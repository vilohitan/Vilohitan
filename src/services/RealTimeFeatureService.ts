import { FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { Subject, BehaviorSubject } from 'rxjs';

interface RealTimeFeatureState {
  timestamp: string;
  user: string;
  features: {
    free: Record<string, any>;
    premium: Record<string, any>;
  };
  activeUsers: Map<string, UserState>;
  metrics: FeatureMetrics;
}

interface UserState {
  id: string;
  lastActive: string;
  currentFeatures: string[];
  subscription: 'free' | 'premium';
  metrics: UserMetrics;
}

interface FeatureMetrics {
  totalActiveUsers: number;
  featureUsage: Record<string, number>;
  realtimeLoad: number;
}

interface UserMetrics {
  swipesToday: number;
  matchesCount: number;
  activeTime: number;
  lastLocation: {
    lat: number;
    lng: number;
    timestamp: string;
  };
}

export class RealTimeFeatureService {
  private db: FirebaseApp;
  private state: BehaviorSubject<RealTimeFeatureState>;
  private userUpdates: Subject<UserState>;
  private metricsUpdates: Subject<FeatureMetrics>;
  
  constructor() {
    this.state = new BehaviorSubject<RealTimeFeatureState>({
      timestamp: '2025-02-15 07:36:30',
      user: 'vilohitan',
      features: {
        free: {},
        premium: {}
      },
      activeUsers: new Map(),
      metrics: {
        totalActiveUsers: 0,
        featureUsage: {},
        realtimeLoad: 0
      }
    });
    
    this.userUpdates = new Subject<UserState>();
    this.metricsUpdates = new Subject<FeatureMetrics>();
    this.initializeRealtimeListeners();
  }

  private initializeRealtimeListeners() {
    // Listen for feature updates
    onSnapshot(collection(this.db, 'features'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          this.updateFeatures(change.doc.id, change.doc.data());
        }
      });
    });

    // Listen for user state changes
    onSnapshot(collection(this.db, 'users'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          this.updateUserState(change.doc.id, change.doc.data() as UserState);
        }
      });
    });

    // Update metrics every 5 seconds
    setInterval(() => {
      this.updateMetrics();
    }, 5000);
  }

  async updateUserState(userId: string, state: UserState) {
    const currentState = this.state.getValue();
    const updatedUsers = new Map(currentState.activeUsers);
    
    state.lastActive = new Date().toISOString();
    updatedUsers.set(userId, state);

    this.state.next({
      ...currentState,
      activeUsers: updatedUsers
    });

    this.userUpdates.next(state);

    // Update Firestore
    await setDoc(doc(this.db, 'users', userId), {
      ...state,
      lastUpdated: serverTimestamp()
    });
  }

  async updateFeatures(tier: 'free' | 'premium', features: Record<string, any>) {
    const currentState = this.state.getValue();
    
    this.state.next({
      ...currentState,
      features: {
        ...currentState.features,
        [tier]: features
      },
      timestamp: new Date().toISOString()
    });

    // Update Firestore
    await setDoc(doc(this.db, 'features', tier), {
      features,
      lastUpdated: serverTimestamp()
    });
  }

  private async updateMetrics() {
    const currentState = this.state.getValue();
    const activeUsers = Array.from(currentState.activeUsers.values());
    
    const metrics: FeatureMetrics = {
      totalActiveUsers: activeUsers.length,
      featureUsage: this.calculateFeatureUsage(activeUsers),
      realtimeLoad: this.calculateRealtimeLoad()
    };

    this.state.next({
      ...currentState,
      metrics
    });

    this.metricsUpdates.next(metrics);

    // Update Firestore
    await setDoc(doc(this.db, 'metrics', 'realtime'), {
      ...metrics,
      lastUpdated: serverTimestamp()
    });
  }

  private calculateFeatureUsage(users: UserState[]): Record<string, number> {
    const usage: Record<string, number> = {};
    
    users.forEach(user => {
      user.currentFeatures.forEach(feature => {
        usage[feature] = (usage[feature] || 0) + 1;
      });
    });

    return usage;
  }

  private calculateRealtimeLoad(): number {
    const currentState = this.state.getValue();
    const activeUsers = currentState.activeUsers.size;
    const maxCapacity = 1000000; // Adjust based on system capacity
    
    return (activeUsers / maxCapacity) * 100;
  }

  // Public API methods
  subscribeToFeatures(userId: string) {
    return this.state.asObservable();
  }

  subscribeToUserUpdates(userId: string) {
    return this.userUpdates.asObservable();
  }

  subscribeToMetrics() {
    return this.metricsUpdates.asObservable();
  }

  async getUserFeatures(userId: string) {
    const currentState = this.state.getValue();
    const userState = currentState.activeUsers.get(userId);
    
    if (!userState) {
      return currentState.features.free;
    }

    return currentState.features[userState.subscription];
  }

  async updateUserFeatures(userId: string, features: string[]) {
    const userState = this.state.getValue().activeUsers.get(userId);
    
    if (userState) {
      await this.updateUserState(userId, {
        ...userState,
        currentFeatures: features
      });
    }
  }
}