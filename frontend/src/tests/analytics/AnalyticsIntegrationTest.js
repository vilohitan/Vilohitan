import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';

class AnalyticsIntegrationTest {
  constructor() {
    this.timestamp = '2025-02-15 07:22:06';
    this.user = 'vilohitan';
    this.events = [];
    this.userProperties = new Map();
  }

  async testEventTracking(event, params = {}) {
    try {
      await analytics().logEvent(event, {
        ...params,
        timestamp: this.timestamp,
        platform: Platform.OS
      });

      this.events.push({
        event,
        params,
        timestamp: this.timestamp
      });

      return {
        success: true,
        event,
        params,
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

  async testUserPropertySetting(property, value) {
    try {
      await analytics().setUserProperty(property, value);
      this.userProperties.set(property, {
        value,
        timestamp: this.timestamp
      });

      return {
        success: true,
        property,
        value,
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

  async testScreenTracking(screenName, screenClass) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass
      });

      return {
        success: true,
        screenName,
        screenClass,
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

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      events: this.events,
      userProperties: Array.from(this.userProperties.entries()),
      summary: {
        totalEvents: this.events.length,
        uniqueProperties: this.userProperties.size
      }
    };
  }
}

export default new AnalyticsIntegrationTest();