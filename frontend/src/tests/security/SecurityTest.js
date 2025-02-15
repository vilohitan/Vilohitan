import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class SecurityTest {
  constructor() {
    this.timestamp = '2025-02-14 19:42:39';
    this.user = 'vilohitan';
    this.vulnerabilities = [];
  }

  // Token Security Tests
  testJWTSecurity(token) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      
      const checks = [
        {
          name: 'Algorithm Check',
          passed: decoded.header.alg === 'RS256',
          severity: 'HIGH'
        },
        {
          name: 'Expiration Check',
          passed: decoded.payload.exp > Date.now() / 1000,
          severity: 'CRITICAL'
        },
        {
          name: 'Issuer Check',
          passed: decoded.payload.iss === 'dspot.auth',
          severity: 'MEDIUM'
        }
      ];

      checks.forEach(check => {
        if (!check.passed) {
          this.reportVulnerability(
            'JWT Security',
            check.name,
            check.severity
          );
        }
      });

      return checks.every(check => check.passed);
    } catch (error) {
      this.reportVulnerability(
        'JWT Security',
        'Token Parse Failed',
        'CRITICAL'
      );
      return false;
    }
  }

  // Data Encryption Tests
  testDataEncryption(data, encryptionKey) {
    try {
      // Test encryption strength
      const cipher = crypto.createCipher('aes-256-gcm', encryptionKey);
      const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(data), 'utf8'),
        cipher.final()
      ]);

      const checks = [
        {
          name: 'Encryption Key Length',
          passed: encryptionKey.length >= 32,
          severity: 'HIGH'
        },
        {
          name: 'Data Transformation',
          passed: encrypted.length > 0,
          severity: 'CRITICAL'
        }
      ];

      checks.forEach(check => {
        if (!check.passed) {
          this.reportVulnerability(
            'Data Encryption',
            check.name,
            check.severity
          );
        }
      });

      return checks.every(check => check.passed);
    } catch (error) {
      this.reportVulnerability(
        'Data Encryption',
        'Encryption Failed',
        'CRITICAL'
      );
      return false;
    }
  }

  // Input Validation Tests
  testInputSanitization(input) {
    const vulnerablePatterns = [
      {
        pattern: /<script/i,
        name: 'XSS Attack',
        severity: 'CRITICAL'
      },
      {
        pattern: /\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b/i,
        name: 'SQL Injection',
        severity: 'CRITICAL'
      },
      {
        pattern: /\.\.\//,
        name: 'Path Traversal',
        severity: 'HIGH'
      }
    ];

    vulnerablePatterns.forEach(({ pattern, name, severity }) => {
      if (pattern.test(input)) {
        this.reportVulnerability(
          'Input Validation',
          name,
          severity
        );
      }
    });

    return !this.vulnerabilities.some(v => v.type === 'Input Validation');
  }

  // API Security Tests
  testAPIEndpoint(endpoint, method, headers) {
    const checks = [
      {
        name: 'HTTPS Check',
        passed: endpoint.startsWith('https://'),
        severity: 'CRITICAL'
      },
      {
        name: 'Authentication Header',
        passed: headers.hasOwnProperty('Authorization'),
        severity: 'HIGH'
      },
      {
        name: 'Content Security',
        passed: headers.hasOwnProperty('Content-Security-Policy'),
        severity: 'MEDIUM'
      }
    ];

    checks.forEach(check => {
      if (!check.passed) {
        this.reportVulnerability(
          'API Security',
          check.name,
          check.severity
        );
      }
    });

    return checks.every(check => check.passed);
  }

  reportVulnerability(type, description, severity) {
    this.vulnerabilities.push({
      type,
      description,
      severity,
      timestamp: this.timestamp,
      user: this.user
    });
  }

  generateSecurityReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      vulnerabilities: this.vulnerabilities,
      summary: {
        total: this.vulnerabilities.length,
        critical: this.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
        high: this.vulnerabilities.filter(v => v.severity === 'HIGH').length,
        medium: this.vulnerabilities.filter(v => v.severity === 'MEDIUM').length
      }
    };
  }
}

export default new SecurityTest();