interface FeatureConfig {
  id: string;
  name: string;
  type: 'free' | 'premium';
  enabled: boolean;
  config: Record<string, any>;
  limits: Record<string, number>;
  dependencies: string[];
}

class RealTimeFeatureConfig {
  private configs: Map<string, FeatureConfig>;
  private configUpdates: Subject<FeatureConfig>;
  private db: FirebaseApp;

  constructor() {
    this.configs = new Map();
    this.configUpdates = new Subject<FeatureConfig>();
    this.initializeConfigs();
    this.setupRealtimeSync();
  }

  private async initializeConfigs() {
    const defaultConfigs: FeatureConfig[] = [
      {
        id: 'swipes',
        name: 'Daily Swipes',
        type: 'free',
        enabled: true,
        config: {
          limit: 50,
          resetInterval: 86400 // 24 hours in seconds
        },
        limits: {
          minAge: 18,
          maxDistance: 100
        },
        dependencies: []
      },
      {
        id: 'matching',
        name: 'AI Matching',
        type: 'premium',
        enabled: true,
        config: {
          aiEnabled: true,
          updateInterval: 300 // 5 minutes in seconds
        },
        limits: {
          maxMatches: 1000,
          processingTime: 2 // seconds
        },
        dependencies: ['swipes']
      }
      // Add more feature configs
    ];

    defaultConfigs.forEach(config => {
      this.configs.set(config.id, config);
    });

    // Sync with Firestore
    await this.syncToFirestore();
  }

  private setupRealtimeSync() {
    // Listen for config changes in Firestore
    onSnapshot(collection(this.db, 'featureConfigs'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const config = change.doc.data() as FeatureConfig;
          this.updateConfig(config);
        }
      });
    });
  }

  private async syncToFirestore() {
    const batch = this.db.batch();
    
    this.configs.forEach((config, id) => {
      const ref = doc(this.db, 'featureConfigs', id);
      batch.set(ref, {
        ...config,
        lastUpdated: serverTimestamp()
      });
    });

    await batch.commit();
  }

  updateConfig(config: FeatureConfig) {
    this.configs.set(config.id, config);
    this.configUpdates.next(config);
  }

  getConfig(featureId: string): FeatureConfig | undefined {
    return this.configs.get(featureId);
  }

  subscribeToConfigUpdates() {
    return this.configUpdates.asObservable();
  }

  getAllConfigs() {
    return Array.from(this.configs.values());
  }

  async validateFeatureAccess(featureId: string, userId: string): Promise<boolean> {
    const config = this.configs.get(featureId);
    if (!config || !config.enabled) return false;

    // Check user subscription type
    const userSubscription = await this.getUserSubscription(userId);
    if (config.type === 'premium' && userSubscription !== 'premium') {
      return false;
    }

    // Check dependencies
    for (const depId of config.dependencies) {
      const depConfig = this.configs.get(depId);
      if (!depConfig || !depConfig.enabled) {
        return false;
      }
    }

    return true;
  }

  private async getUserSubscription(userId: string): Promise<'free' | 'premium'> {
    const userDoc = await this.db.collection('users').doc(userId).get();
    return userDoc.data()?.subscription || 'free';
  }
}