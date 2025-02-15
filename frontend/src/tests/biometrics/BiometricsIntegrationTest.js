import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

class BiometricsIntegrationTest {
  constructor() {
    this.timestamp = '2025-02-15 07:22:06';
    this.user = 'vilohitan';
    this.results = new Map();
  }

  async testBiometricAvailability() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      return {
        success: true,
        hasHardware,
        isEnrolled,
        platform: Platform.OS,
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

  async testBiometricAuthentication() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Test Biometric Authentication',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true
      });

      this.results.set('authentication', {
        success: result.success,
        timestamp: this.timestamp
      });

      return {
        success: result.success,
        result,
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

  async testBiometricTypes() {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const mappedTypes = types.map(type => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return 'FINGERPRINT';
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return 'FACIAL_RECOGNITION';
          case LocalAuthentication.AuthenticationType.IRIS:
            return 'IRIS';
          default:
            return 'UNKNOWN';
        }
      });

      return {
        success: true,
        types: mappedTypes,
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
      results: Array.from(this.results.entries()),
      summary: {
        totalTests: this.results.size,
        successfulTests: Array.from(this.results.values())
          .filter(r => r.success).length
      }
    };
  }
}

export default new BiometricsIntegrationTest();