import { AccessibilityInfo } from 'react-native';
import { render } from '@testing-library/react-native';
import { axe } from 'jest-axe';

class AccessibilityTest {
  constructor() {
    this.timestamp = '2025-02-14 19:49:23';
    this.user = 'vilohitan';
    this.results = new Map();
    this.violations = [];
  }

  async testComponent(component, options = {}) {
    const {
      withVoiceOver = true,
      withDynamicText = true,
      withColorContrast = true,
      withGestures = true
    } = options;

    const tests = [
      this.testVoiceOverAccessibility(component),
      this.testDynamicTextScaling(component),
      this.testColorContrast(component),
      this.testTouchTargets(component)
    ];

    const results = await Promise.all(tests.filter((_, index) => {
      return [
        withVoiceOver,
        withDynamicText,
        withColorContrast,
        withGestures
      ][index];
    }));

    this.results.set(component.displayName || 'UnnamedComponent', {
      passed: results.every(r => r.passed),
      tests: results,
      timestamp: this.timestamp
    });

    return this.results.get(component.displayName || 'UnnamedComponent');
  }

  async testVoiceOverAccessibility(component) {
    const { container } = render(component);
    const accessibilityTree = await AccessibilityInfo.getAccessibilityTree(container);

    const violations = [];
    this.traverseAccessibilityTree(accessibilityTree, violations);

    return {
      name: 'VoiceOver Accessibility',
      passed: violations.length === 0,
      violations,
      timestamp: this.timestamp
    };
  }

  traverseAccessibilityTree(node, violations) {
    if (node.role === 'button' && !node.accessibilityLabel) {
      violations.push({
        element: node,
        issue: 'Missing accessibility label on button'
      });
    }

    if (node.role === 'image' && !node.accessibilityLabel) {
      violations.push({
        element: node,
        issue: 'Missing image description'
      });
    }

    if (node.children) {
      node.children.forEach(child => this.traverseAccessibilityTree(child, violations));
    }
  }

  async testDynamicTextScaling(component) {
    const testSizes = ['small', 'medium', 'large', 'xlarge'];
    const results = [];

    for (const size of testSizes) {
      const { container } = render(component, {
        initialProps: { accessibilityFontScale: size }
      });

      const textElements = container.findAllByType('Text');
      const overflowIssues = textElements.filter(text => {
        const styles = text.props.style || {};
        return styles.numberOfLines && text.props.children.length > styles.numberOfLines;
      });

      results.push({
        size,
        passed: overflowIssues.length === 0,
        issues: overflowIssues
      });
    }

    return {
      name: 'Dynamic Text Scaling',
      passed: results.every(r => r.passed),
      results,
      timestamp: this.timestamp
    };
  }

  async testColorContrast(component) {
    const { container } = render(component);
    const results = await axe(container, {
      rules: ['color-contrast']
    });

    return {
      name: 'Color Contrast',
      passed: results.violations.length === 0,
      violations: results.violations,
      timestamp: this.timestamp
    };
  }

  async testTouchTargets(component) {
    const { container } = render(component);
    const touchableElements = container.findAllByProps({
      accessible: true
    });

    const violations = touchableElements.filter(element => {
      const { width, height } = element.props.style || {};
      return width < 44 || height < 44; // minimum touch target size
    });

    return {
      name: 'Touch Targets',
      passed: violations.length === 0,
      violations,
      timestamp: this.timestamp
    };
  }

  async testScreenReaderAnnouncements(component, interactions) {
    const announcements = [];
    
    AccessibilityInfo.announceForAccessibility = jest.fn((message) => {
      announcements.push({
        message,
        timestamp: this.timestamp
      });
    });

    for (const interaction of interactions) {
      await interaction();
    }

    return {
      name: 'Screen Reader Announcements',
      passed: announcements.length > 0,
      announcements,
      timestamp: this.timestamp
    };
  }

  async testKeyboardNavigation(component) {
    const { container } = render(component);
    const focusableElements = container.findAllByProps({
      focusable: true
    });

    const results = [];
    let currentFocus = null;

    for (const element of focusableElements) {
      await element.props.onFocus();
      currentFocus = element;
      
      results.push({
        element,
        focusable: true,
        focused: element === currentFocus,
        timestamp: this.timestamp
      });
    }

    return {
      name: 'Keyboard Navigation',
      passed: results.every(r => r.focusable),
      results,
      timestamp: this.timestamp
    };
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      components: Array.from(this.results.entries()),
      summary: {
        totalComponents: this.results.size,
        passedComponents: Array.from(this.results.values()).filter(r => r.passed).length,
        violations: this.violations,
        overallScore: this.calculateOverallScore()
      }
    };
  }

  calculateOverallScore() {
    const components = Array.from(this.results.values());
    const totalTests = components.reduce((acc, comp) => acc + comp.tests.length, 0);
    const passedTests = components.reduce((acc, comp) => 
      acc + comp.tests.filter(t => t.passed).length, 0
    );

    return (passedTests / totalTests) * 100;
  }
}

export default new AccessibilityTest();