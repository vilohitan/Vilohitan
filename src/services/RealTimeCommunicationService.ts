import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import WebRTC from 'react-native-webrtc';
import { Subject, BehaviorSubject } from 'rxjs';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  content: string;
  mediaUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  metadata?: Record<string, any>;
}

interface CallSession {
  id: string;
  initiatorId: string;
  receiverId: string;
  type: 'audio' | 'video';
  status: 'initiating' | 'ringing' | 'connected' | 'ended';
  startTime: string;
  endTime?: string;
  metadata: {
    quality: string;
    networkStats: Record<string, any>;
    duration?: number;
  };
}

export class RealTimeCommunicationService {
  private db: FirebaseApp;
  private storage: any;
  private messageSubject: Subject<Message>;
  private callSubject: Subject<CallSession>;
  private activeCalls: Map<string, CallSession>;
  private peerConnections: Map<string, any>;
  private mediaStreams: Map<string, MediaStream>;

  constructor() {
    this.db = getFirestore();
    this.storage = getStorage();
    this.messageSubject = new Subject<Message>();
    this.callSubject = new Subject<CallSession>();
    this.activeCalls = new Map();
    this.peerConnections = new Map();
    this.mediaStreams = new Map();
    
    this.initializeWebRTC();
    this.setupMessageListeners();
    this.setupCallListeners();
  }

  private initializeWebRTC() {
    WebRTC.initialize({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com',
          username: 'username',
          credential: 'credential'
        }
      ]
    });
  }

  private setupMessageListeners() {
    const messagesRef = collection(this.db, 'messages');
    
    onSnapshot(messagesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const message = change.doc.data() as Message;
          this.messageSubject.next(message);
          this.updateMessageStatus(message);
        }
      });
    });
  }

  private setupCallListeners() {
    const callsRef = collection(this.db, 'calls');
    
    onSnapshot(callsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const call = change.doc.data() as CallSession;
          this.handleCallUpdate(call);
        }
      });
    });
  }

  async sendMessage(message: Partial<Message>) {
    const messageId = doc(collection(this.db, 'messages')).id;
    const timestamp = new Date().toISOString();

    const fullMessage: Message = {
      id: messageId,
      timestamp,
      status: 'sent',
      ...message
    } as Message;

    if (message.type !== 'text' && message.mediaUrl) {
      fullMessage.mediaUrl = await this.uploadMedia(
        message.mediaUrl,
        message.type
      );
    }

    await setDoc(doc(this.db, 'messages', messageId), fullMessage);
    return fullMessage;
  }

  private async uploadMedia(uri: string, type: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `${Date.now()}_${type}`;
    const storageRef = ref(this.storage, `media/${filename}`);
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }

  async initiateCall(callData: Partial<CallSession>) {
    const callId = doc(collection(this.db, 'calls')).id;
    const timestamp = new Date().toISOString();

    const call: CallSession = {
      id: callId,
      startTime: timestamp,
      status: 'initiating',
      metadata: {
        quality: 'auto',
        networkStats: {}
      },
      ...callData
    } as CallSession;

    await setDoc(doc(this.db, 'calls', callId), call);
    this.setupWebRTCConnection(call);
    return call;
  }

  private async setupWebRTCConnection(call: CallSession) {
    const peerConnection = new WebRTC.RTCPeerConnection();
    this.peerConnections.set(call.id, peerConnection);

    // Handle ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await updateDoc(doc(this.db, 'calls', call.id), {
          'metadata.iceCandidate': event.candidate.toJSON()
        });
      }
    };

    // Handle stream
    peerConnection.ontrack = (event) => {
      this.mediaStreams.set(call.id, event.streams[0]);
      this.callSubject.next({
        ...call,
        metadata: {
          ...call.metadata,
          hasRemoteStream: true
        }
      });
    };

    if (call.type === 'video') {
      const stream = await WebRTC.getUserMedia({
        audio: true,
        video: true
      });
      stream.getTracks().forEach(track => 
        peerConnection.addTrack(track, stream)
      );
    } else {
      const stream = await WebRTC.getUserMedia({
        audio: true,
        video: false
      });
      stream.getTracks().forEach(track => 
        peerConnection.addTrack(track, stream)
      );
    }
  }

  async answerCall(callId: string) {
    const call = this.activeCalls.get(callId);
    if (!call) return;

    const peerConnection = this.peerConnections.get(callId);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    await updateDoc(doc(this.db, 'calls', callId), {
      status: 'connected',
      'metadata.answer': answer.toJSON()
    });
  }

  async endCall(callId: string) {
    const call = this.activeCalls.get(callId);
    if (!call) return;

    const peerConnection = this.peerConnections.get(callId);
    peerConnection.close();

    this.peerConnections.delete(callId);
    this.mediaStreams.delete(callId);
    this.activeCalls.delete(callId);

    await updateDoc(doc(this.db, 'calls', callId), {
      status: 'ended',
      endTime: new Date().toISOString()
    });
  }

  subscribeToMessages(userId: string) {
    return this.messageSubject.asObservable();
  }

  subscribeToCalls(userId: string) {
    return this.callSubject.asObservable();
  }

  private async updateMessageStatus(message: Message) {
    if (message.status === 'sent') {
      await updateDoc(doc(this.db, 'messages', message.id), {
        status: 'delivered'
      });
    }
  }

  private async handleCallUpdate(call: CallSession) {
    this.activeCalls.set(call.id, call);
    this.callSubject.next(call);

    if (call.status === 'ended') {
      this.cleanupCall(call.id);
    }
  }

  private cleanupCall(callId: string) {
    const peerConnection = this.peerConnections.get(callId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(callId);
    }

    const mediaStream = this.mediaStreams.get(callId);
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStreams.delete(callId);
    }

    this.activeCalls.delete(callId);
  }

  async getMessageHistory(userId: string, limit: number = 50) {
    const messagesRef = collection(this.db, 'messages');
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Message);
  }

  async getCallHistory(userId: string, limit: number = 20) {
    const callsRef = collection(this.db, 'calls');
    const q = query(
      callsRef,
      where('participants', 'array-contains', userId),
      orderBy('startTime', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CallSession);
  }
}