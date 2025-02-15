import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheManager {
  constructor() {
    this.lastSync = '2025-02-14 19:19:12';
    this.user = 'vilohitan';
    this.prefix = `dspot_${this.user}_`;
    this.TTL = {
      matches: 3600000, // 1 hour
      messages: 300000, // 5 minutes
      profile: 86400000 // 24 hours
    };
  }

  async set(key, data, ttl = null) {
    const cacheKey = this.prefix + key;
    const cacheData = {
      data,
      timestamp: '2025-02-14 19:19:12',
      expires: ttl ? Date.now() + ttl : null
    };

    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache set failed:', error);
      return false;
    }
  }

  async get(key) {
    const cacheKey = this.prefix + key;

    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp, expires } = JSON.parse(cached);

      if (expires && Date.now() > expires) {
        await this.remove(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache get failed:', error);
      return null;
    }
  }

  async remove(key) {
    const cacheKey = this.prefix + key;
    try {
      await AsyncStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Cache remove failed:', error);
      return false;
    }
  }

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(userKeys);
      console.log(`Cache cleared for user ${this.user}`);
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }

  async getCacheSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => key.startsWith(this.prefix));
      let totalSize = 0;

      for (const key of userKeys) {
        const value = await AsyncStorage.getItem(key);
        totalSize += value.length * 2; // UTF-16 encoding
      }

      return {
        keys: userKeys.length,
        sizeInBytes: totalSize,
        timestamp: '2025-02-14 19:19:12'
      };
    } catch (error) {
      console.error('Cache size calculation failed:', error);
      return null;
    }
  }
}

export default new CacheManager();