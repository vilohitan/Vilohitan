import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { findMissingTranslations, validatePlaceholders } from './utils';

class LocalizationTest {
  constructor() {
    this.timestamp = '2025-02-14 19:48:02';
    this.user = 'vilohitan';
    this.supportedLocales = ['en', 'es', 'fr', 'de', 'ja'];
    this.results = new Map();
  }

  async initializeI18n(resources) {
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      });
  }

  async testLocale(locale, resources) {
    try {
      await i18n.changeLanguage(locale);
      
      const tests = [
        this.testCompleteness(locale, resources),
        this.testPlaceholders(locale, resources),
        this.testPluralRules(locale),
        this.testDateFormatting(locale),
        this.testNumberFormatting(locale)
      ];

      const results = await Promise.all(tests);
      
      this.results.set(locale, {
        passed: results.every(r => r.passed),
        tests: results,
        timestamp: this.timestamp
      });

      return this.results.get(locale);
    } catch (error) {
      return {
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testCompleteness(locale, resources) {
    const missing = findMissingTranslations(resources.en, resources[locale]);
    
    return {
      name: 'Translation Completeness',
      passed: missing.length === 0,
      missing,
      timestamp: this.timestamp
    };
  }

  async testPlaceholders(locale, resources) {
    const invalidPlaceholders = validatePlaceholders(resources.en, resources[locale]);
    
    return {
      name: 'Placeholder Validation',
      passed: invalidPlaceholders.length === 0,
      invalid: invalidPlaceholders,
      timestamp: this.timestamp
    };
  }

  async testPluralRules(locale) {
    const testCases = [0, 1, 2, 5, 10];
    const results = testCases.map(count => {
      const key = 'common.items';
      const translated = i18n.t(key, { count });
      
      return {
        count,
        translation: translated,
        valid: !translated.includes(key) // Key not found would return the key itself
      };
    });

    return {
      name: 'Plural Rules',
      passed: results.every(r => r.valid),
      results,
      timestamp: this.timestamp
    };
  }

  async testDateFormatting(locale) {
    const testDate = new Date('2025-02-14 19:48:02');
    const formats = ['short', 'medium', 'long', 'full'];
    
    const results = formats.map(format => {
      try {
        const formatted = new Intl.DateTimeFormat(locale, {
          dateStyle: format
        }).format(testDate);

        return {
          format,
          result: formatted,
          valid: true
        };
      } catch (error) {
        return {
          format,
          error: error.message,
          valid: false
        };
      }
    });

    return {
      name: 'Date Formatting',
      passed: results.every(r => r.valid),
      results,
      timestamp: this.timestamp
    };
  }

  async testNumberFormatting(locale) {
    const testNumbers = [1234.56, -1234.56, 0.123, 1000000];
    
    const results = testNumbers.map(number => {
      try {
        const formatted = new Intl.NumberFormat(locale).format(number);
        
        return {
          number,
          result: formatted,
          valid: true
        };
      } catch (error) {
        return {
          number,
          error: error.message,
          valid: false
        };
      }
    });

    return {
      name: 'Number Formatting',
      passed: results.every(r => r.valid),
      results,
      timestamp: this.timestamp
    };
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      locales: Array.from(this.results.entries()),
      summary: {
        totalLocales: this.results.size,
        passedLocales: Array.from(this.results.values()).filter(r => r.passed).length,
        failedLocales: Array.from(this.results.values()). ▋