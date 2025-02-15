import { Image } from 'react-native';
import * as FileSystem from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

class ImageOptimizer {
  constructor() {
    this.lastOptimization = '2025-02-14 19:19:12';
    this.user = 'vilohitan';
    this.cacheDir = FileSystem.CacheDirectoryPath + '/optimizedImages';
    this.setupCacheDirectory();
  }

  async setupCacheDirectory() {
    const exists = await FileSystem.exists(this.cacheDir);
    if (!exists) {
      await FileSystem.mkdir(this.cacheDir);
    }
  }

  async optimizeImage(uri, options = {}) {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'JPEG'
    } = options;

    try {
      const optimized = await ImageResizer.createResizedImage(
        uri,
        maxWidth,
        maxHeight,
        format,
        quality * 100,
        0,
        this.cacheDir
      );

      return {
        uri: optimized.uri,
        width: optimized.width,
        height: optimized.height,
        size: optimized.size
      };
    } catch (error) {
      console.error('Image optimization failed:', error);
      return { uri };
    }
  }

  async preloadImage(uri) {
    try {
      await Image.prefetch(uri);
      return true;
    } catch (error) {
      console.error('Image preloading failed:', error);
      return false;
    }
  }

  getCacheKey(uri) {
    return `${this.user}_${uri.split('/').pop()}`;
  }

  async cacheImage(uri) {
    const cacheKey = this.getCacheKey(uri);
    const cachePath = `${this.cacheDir}/${cacheKey}`;

    try {
      await FileSystem.downloadFile({
        fromUrl: uri,
        toFile: cachePath
      });
      return cachePath;
    } catch (error) {
      console.error('Image caching failed:', error);
      return uri;
    }
  }

  async clearCache() {
    try {
      const files = await FileSystem.readDir(this.cacheDir);
      await Promise.all(
        files.map(file => 
          FileSystem.unlink(`${this.cacheDir}/${file.name}`)
        )
      );
      console.log(`Cache cleared for user ${this.user}`);
    } catch (error) {
      console.error('Cache clearing failed:', error);
    }
  }
}

export default new ImageOptimizer();