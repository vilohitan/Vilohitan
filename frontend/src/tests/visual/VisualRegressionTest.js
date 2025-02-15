import { captureScreenshot, compareImages } from 'jest-image-snapshot';
import { devicePresets } from './device-presets';

class VisualRegressionTest {
  constructor() {
    this.timestamp = '2025-02-14 19:45:26';
    this.user = 'vilohitan';
    this.snapshotDir = '__visual_snapshots__';
    this.diffDir = '__visual_diffs__';
    this.results = new Map();
  }

  async captureComponent(component, options = {}) {
    const {
      devicePreset = 'iPhone13',
      theme = 'light',
      state = 'default'
    } = options;

    const device = devicePresets[devicePreset];
    const fileName = this.generateFileName(component.name, {
      device: devicePreset,
      theme,
      state
    });

    try {
      const screenshot = await captureScreenshot(component, {
        ...device,
        path: `${this.snapshotDir}/${fileName}`
      });

      this.results.set(fileName, {
        status: 'captured',
        timestamp: this.timestamp,
        metadata: { devicePreset, theme, state }
      });

      return screenshot;
    } catch (error) {
      this.results.set(fileName, {
        status: 'error',
        error: error.message,
        timestamp: this.timestamp
      });
      throw error;
    }
  }

  async compareWithBaseline(component, options = {}) {
    const {
      devicePreset = 'iPhone13',
      theme = 'light',
      state = 'default',
      threshold = 0.01
    } = options;

    const currentSnapshot = await this.captureComponent(component, {
      devicePreset,
      theme,
      state
    });

    const baselineFileName = this.generateFileName(component.name, {
      device: devicePreset,
      theme,
      state,
      baseline: true
    });

    try {
      const comparison = await compareImages(
        currentSnapshot,
        `${this.snapshotDir}/${baselineFileName}`,
        {
          threshold,
          outputDiff: true,
          diffDir: this.diffDir
        }
      );

      this.results.set(baselineFileName, {
        status: comparison.pass ? 'passed' : 'failed',
        diffPercentage: comparison.diffPercentage,
        timestamp: this.timestamp
      });

      return comparison;
    } catch (error) {
      this.results.set(baselineFileName, {
        status: 'error',
        error: error.message,
        timestamp: this.timestamp
      });
      throw error;
    }
  }

  async testResponsiveness(component, breakpoints = Object.keys(devicePresets)) {
    const results = [];

    for (const device of breakpoints) {
      const result = await this.captureComponent(component, { devicePreset: device });
      results.push({
        device,
        result,
        timestamp: this.timestamp
      });
    }

    return results;
  }

  async testThemes(component, themes = ['light', 'dark']) {
    const results = [];

    for (const theme of themes) {
      const result = await this.captureComponent(component, { theme });
      results.push({
        theme,
        result,
        timestamp: this.timestamp
      });
    }

    return results;
  }

  async testInteractionStates(component, states = ['default', 'hover', 'pressed', 'disabled']) {
    const results = [];

    for (const state of states) {
      const result = await this.captureComponent(component, { state });
      results.push({
        state,
        result,
        timestamp: this.timestamp
      });
    }

    return results;
  }

  generateFileName(componentName, options) {
    const { device, theme, state, baseline } = options;
    return `${componentName}-${device}-${theme}-${state}${baseline ? '-baseline' : ''}.png`;
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      results: Array.from(this.results.entries()),
      summary: {
        total: this.results.size,
        passed: Array.from(this.results.values()).filter(r => r.status === 'passed').length,
        failed: Array.from(this.results.values()).filter(r => r.status === 'failed').length,
        errors: Array.from(this.results.values()).filter(r => r.status === 'error').length
      }
    };
  }
}

export default new VisualRegressionTest();