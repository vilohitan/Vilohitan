import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { render, act } from '@testing-library/react-native';

class DeepLinkTest {
  constructor() {
    this.timestamp = '2025-02-14 19:49:23';
    this.user = 'vilohitan';
    this.results = new Map();
    this.navigationRef = null;
  }

  async testDeepLink(link, expectedRoute, params = {}) {
    try {
      await act(async () => {
        await Linking.openURL(link);
      });

      const currentRoute = this.navigationRef?.getCurrentRoute();
      const passed = this.validateRoute(currentRoute, expectedRoute, params);

      this.results.set(link, {
        passed,
        expectedRoute,
        actualRoute: currentRoute,
        params,
        timestamp: this.timestamp
      });

      return this.results.get(link);
    } catch (error) {
      return {
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  validateRoute(currentRoute, expectedRoute, expectedParams) {
    if (!currentRoute) return false;
    if (currentRoute.name !== expectedRoute) return false;

    return Object.entries(expectedParams).every(([key, value]) => 
      currentRoute.params?.[key] === value
    );
  }

  async testDeepLinkFlow(links) {
    const results = [];

    for (const { link, expectedRoute, params } of links) {
      const result = await this.testDeepLink(link, expectedRoute, params);
      results.push({
        link,
        result,
        timestamp: this.timestamp
      });
    }

    return results;
  }

  async testDynamicLinks(linkTemplates, parameters) {
    const results = [];

    for (const template of linkTemplates) {
      for (const param of parameters) {
        const link = this.buildDynamicLink(template, param);
        const result = await this.testDeepLink(link, template.expectedRoute, param);
        
        results.push({
          template: template.name,
          link,
          result,
          timestamp: this.timestamp
        });
      }
    }

    return results;
  }

  buildDynamicLink(template, params) {
    let link = template.url;
    Object.entries(params).forEach(([key, value]) => {
      link = link.replace(`:${key}`, value);
    });
    return link;
  }

  async testUniversalLinks(links) {
    const results = [];

    for (const link of links) {
      try {
        const canOpen = await Linking.canOpenURL(link);
        if (canOpen) {
          const result = await this.testDeepLink(link, 'UniversalRoute');
          results.push({
            link,
            supported: true,
            result,
            timestamp: this.timestamp
          });
        } else {
          results.push({
            link,
            supported: false,
            timestamp: this.timestamp
          });
        }
      } catch (error) {
        results.push({
          link,
          supported: false,
          error: error.message,
          timestamp: this.timestamp
        });
      }
    }

    return results;
  }

  async testDeepLinkErrors(invalidLinks) {
    const results = [];

    for (const link of invalidLinks) {
      try {
        await this.testDeepLink(link, 'ErrorRoute');
        results.push({
          link,
          handled: true,
          timestamp: this.timestamp
        });
      } catch (error) {
        results.push({
          link,
          handled: false,
          error: error.message,
          timestamp: this.timestamp
        });
      }
    }

    return results;
  }

  setNavigationRef(ref) {
    this.navigationRef = ref;
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      links: Array.from(this.results.entries()),
      summary: {
        totalTests: this.results.size,
        passedTests: Array.from(this.results.values()).filter(r => r.passed).length,
        failedTests: Array.from(this.results.values()).filter(r => !r.passed).length
      }
    };
  }
}

export default new DeepLinkTest();