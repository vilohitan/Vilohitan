import { io } from 'socket.io-client';
import NotificationService from './NotificationService';

class RealtimeService {
  constructor() {
    this.socket = null;
    this.lastUpdated = '2025-02-14 19:15:21';
    this.currentUser = 'vilohitan';
    this.listeners = new Map();
  }

  connect = (userId = this.currentUser) => {
    this.socket = io('https://api.dspot.com', {
      query: {
        userId,
        timestamp: this.lastUpdated
      }
    });

    this.setupEventListeners();
  };

  setupEventListeners = () => {
    this.socket.on('connect', () => {
      console.log('Connected to realtime server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from realtime server');
    });

    // Match events
    this.socket.on('match', (data) => {
      this ▋