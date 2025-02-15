import { Platform, InteractionManager } from 'react-native';

class MemoryManager {
  constructor() {
    this.lastCheck = '2025-02-14 19:21:34';
    this.user = 'vilohitan';
    this.memoryThresholds = {
      warning: 150 * 1024 * 1024, // 150MB
      critical: 250 * 1024 * 1024  // 250MB
    };
    this.imageCache = new Map();
    this.resourceCache = new Map();
  }

  getCurrentMemoryUsage() {
    if (Platform.OS === 'android') {
      // Android specific memory info
      return new Promise((resolve) => {
        if (global.performance && global.performance.memory) {
          resolve({
            usedJSHeapSize: global.performance.memory.usedJSHeapSize,
            totalJSHeapSize: global.performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: global.performance.memory.jsHeapSizeLimit,
            timestamp: '2025-02-14 19:21:34'
          });
        } else {
          resolve(null);
        }
      });
    } else {
      // iOS memory management is handled by the system
      return Promise.resolve(null);
    }
  }

  async checkMemoryStatus() {
    const memoryUsage = await this.getCurrentMemoryUsage();
    
    if (memoryUsage) {
      if (memoryUsage.usedJSHeapSize > this.memoryThresholds.critical) {
        await this.handleCriticalMemory();
      } else if (memoryUsage.usedJSHeapSize > this.memoryThresholds.warning) {
        await this.handleMemoryWarning();
      }
    }
  }

  async handleMemoryWarning() {
    console.warn(`Memory warning for user ${this.user} at ${this.lastCheck}`);
    
    // Clear non-essential caches
    this.clearImageCache();
    this.clearResourceCache();
    
    // Schedule garbage collection
    this.scheduleGC();
  }

  async handleCriticalMemory() {
    console.error(`Critical memory status for user ${this.user} at ${this.lastCheck}`);
    
    // Clear all caches
    await this.clearAllCaches();
    
    // Force garbage collection
    this.forceGC();
  }

  clearImageCache() {
    InteractionManager.runAfterInteractions(() => {
      this.imageCache.clear();
      console.log('Image cache cleared');
    });
  }

  clearResourceCache() {
    InteractionManager.runAfterInteractions(() => {
      this.resourceCache.clear();
      console.log('Resource cache cleared');
    });
  }

  async clearAllCaches() {
    await Promise.all([
      this.clearImageCache(),
      this.clearResourceCache()
    ]);
  }

  scheduleGC() {
    InteractionManager.runAfterInteractions(() => {
      if (global.gc) {
        global.gc();
      }
    });
  }

  forceGC() {
    if (global.gc) {
      global.gc();
    }
  }

  cacheResource(key, resource) {
    this.resourceCache.set(key, {
      resource,
      timestamp: '2025-02-14 19:21:34'
    });
  }

  getCachedResource(key) {
    return this.resourceCache.get(key);
  }

  monitorComponent(componentName) {
    return {
      mount: () => {
        console.log(`Component mounted: ${componentName}`);
        this.checkMemoryStatus();
      },
      unmount: () => {
        console.log(`Component unmounted: ${componentName}`);
        this.checkMemoryStatus();
      }
    };
  }
}

export default new MemoryManager();