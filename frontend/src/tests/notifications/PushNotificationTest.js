import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

class PushNotificationTest {
  constructor() {
    this.timestamp = '2025-02-14 19:51:29';
    this.user = 'vilohitan';
    this.results = new Map();
    this.notifications = [];
    this.subscriptions = new Set();
  }

  async setup() {
    try {
      await this.requestPermissions();
      await this.configurePushNotifications();
      return {
        success: true,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async requestPermissions() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
    }
    return true; // Android permissions are handled in manifest
  }

  async configurePushNotifications() {
    PushNotification.configure({
      onRegister: this.handleRegistration.bind(this),
      onNotification: this.handleNotification.bind(this),
      onRegistrationError: this.handleRegistrationError.bind(this),
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  handleRegistration(token) {
    this.results.set('registration', {
      success: true,
      token,
      timestamp: this.timestamp
    });
  }

  handleRegistrationError(error) {
    this.results.set('registration', {
      success: false,
      error: error.message,
      timestamp: this.timestamp
    });
  }

  handleNotification(notification) {
    this.notifications.push({
      ...notification,
      receivedAt: this.timestamp
    });
  }

  async testNotificationDelivery(payload) {
    try {
      await messaging().simulateMessageReceived(payload);
      
      const received = this.notifications.find(
        n => n.messageId === payload.messageId
      );

      return {
        success: !!received,
        notification: received,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testNotificationInteraction(notification) {
    return new Promise((resolve) => {
      PushNotification.localNotification({
        ...notification,
        onPress: () => {
          resolve({
            success: true,
            action: 'pressed',
            timestamp: this.timestamp
          });
        }
      });
    });
  }

  async testTopicSubscription(topic) {
    try {
      await messaging().subscribeToTopic(topic);
      this.subscriptions.add(topic);
      
      return {
        success: true,
        topic,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        topic,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testNotificationScheduling(notification, scheduledTime) {
    return new Promise((resolve) => {
      PushNotification.localNotificationSchedule({
        ...notification,
        date: scheduledTime,
        onSchedule: () => {
          resolve({
            success: true,
            scheduledTime,
            timestamp: this.timestamp
          });
        }
      });
    });
  }

  async testBadgeHandling() {
    try {
      await PushNotification.setApplicationIconBadgeNumber(5);
      const badge = await PushNotification.getApplicationIconBadgeNumber();
      
      return {
        success: badge === 5,
        badge,
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testNotificationChannels() {
    if (Platform.OS === 'android') {
      try {
        const channelId = 'test-channel';
        await PushNotification.createChannel({
          channelId,
          channelName: 'Test Channel',
          importance: 4
        });

        const channels = await PushNotification.getChannels();
        
        return {
          success: channels.includes(channelId),
          channels,
          timestamp: this.timestamp
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          timestamp: this.timestamp
        };
      }
    }
    return { success: true, platform: 'ios', timestamp: this.timestamp };
  }

  async cleanup() {
    // Unsubscribe from topics
    for (const topic of this.subscriptions) {
      await messaging().unsubscribeFromTopic(topic);
    }
    this.subscriptions.clear();

    // Clear notifications
    PushNotification.cancelAllLocalNotifications();
    await PushNotification.setApplicationIconBadgeNumber(0);

    // Clear stored results
    this.results.clear();
    this.notifications = [];
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      results: Array.from(this.results.entries()),
      notifications: this.notifications,
      subscriptions: Array.from(this.subscriptions),
      summary: {
        totalTests: this.results.size,
        passedTests: Array.from(this.results.values()).filter(r => r.success).length,
        failedTests: Array.from(this.results.values()).filter(r => !r.success).length,
        notificationsReceived: this.notifications.length
      }
    };
  }
}

export default new PushNotificationTest();