import https from 'https';
import tls from 'tls';
import { Certificate } from '@peculiar/x509';

class NetworkSecurityTest {
  constructor() {
    this.timestamp = '2025-02-14 19:46:48';
    this.user = 'vilohitan';
    this.results = new Map();
    this.vulnerabilities = [];
  }

  async testEndpointSecurity(endpoint) {
    const securityChecks = [
      this.testTLSVersion(endpoint),
      this.testCertificateValidity(endpoint),
      this.testCipherSuites(endpoint),
      this.testHTTPSRedirect(endpoint),
      this.testSecurityHeaders(endpoint)
    ];

    const results = await Promise.all(securityChecks);
    return this.analyzeResults(results);
  }

  async testTLSVersion(endpoint) {
    try {
      const socket = tls.connect({
        host: new URL(endpoint).hostname,
        port: 443,
        minVersion: 'TLSv1.2'
      });

      return new Promise((resolve) => {
        socket.on('secureConnect', () => {
          const version = socket.getProtocol();
          socket.end();
          resolve({
            test: 'TLS Version',
            passed: version >= 'TLSv1.2',
            details: { version },
            timestamp: this.timestamp
          });
        });
      });
    } catch (error) {
      this.reportVulnerability('TLS', error.message);
      return {
        test: 'TLS Version',
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testCertificateValidity(endpoint) {
    try {
      const cert = await this.getCertificate(endpoint);
      const x509 = new Certificate(cert);
      
      const now = new Date('2025-02-14 19:46:48');
      const isValid = now >= x509.notBefore && now <= x509.notAfter;

      return {
        test: 'Certificate Validity',
        passed: isValid,
        details: {
          issuer: x509.issuer,
          validFrom: x509.notBefore,
          validTo: x509.notAfter
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      this.reportVulnerability('Certificate', error.message);
      return {
        test: 'Certificate Validity',
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testCipherSuites(endpoint) {
    const secureConfiguration = {
      host: new URL(endpoint).hostname,
      port: 443,
      ciphers: 'HIGH:!aNULL:!MD5:!RC4'
    };

    try {
      const socket = tls.connect(secureConfiguration);
      return new Promise((resolve) => {
        socket.on('secureConnect', () => {
          const cipher = socket.getCipher();
          socket.end();
          resolve({
            test: 'Cipher Suites',
            passed: this.isSecureCipher(cipher.name),
            details: cipher,
            timestamp: this.timestamp
          });
        });
      });
    } catch (error) {
      this.reportVulnerability('Cipher', error.message);
      return {
        test: 'Cipher Suites',
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testHTTPSRedirect(endpoint) {
    const httpEndpoint = endpoint.replace('https://', 'http://');
    
    try {
      const response = await fetch(httpEndpoint, { redirect: 'manual' });
      return {
        test: 'HTTPS Redirect',
        passed: response.status === 301 && 
                response.headers.get('location')?.startsWith('https://'),
        details: {
          status: response.status,
          location: response.headers.get('location')
        },
        timestamp: this.timestamp
      };
    } catch (error) {
      this.reportVulnerability('HTTPS Redirect', error.message);
      return {
        test: 'HTTPS Redirect',
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  async testSecurityHeaders(endpoint) {
    try {
      const response = await fetch(endpoint);
      const headers = response.headers;
      
      const requiredHeaders = {
        'Strict-Transport-Security': value => value.includes('max-age='),
        'Content-Security-Policy': value => value.length > 0,
        'X-Content-Type-Options': value => value === 'nosniff',
        'X-Frame-Options': value => ['DENY', 'SAMEORIGIN'].includes(value),
        'X-XSS-Protection': value => value.includes('1')
      };

      const headerChecks = Object.entries(requiredHeaders).map(([header, validator]) => ({
        header,
        present: headers.has(header),
        valid: validator(headers.get(header) || '')
      }));

      return {
        test: 'Security Headers',
        passed: headerChecks.every(check => check.present && check.valid),
        details: { headerChecks },
        timestamp: this.timestamp
      };
    } catch (error) {
      this.reportVulnerability('Security Headers', error.message);
      return {
        test: 'Security Headers',
        passed: false,
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  isSecureCipher(cipherName) {
    const insecureCiphers = [
      'RC4',
      'MD5',
      'SHA1',
      'NULL',
      'EXPORT'
    ];
    return !insecureCiphers.some(weak => cipherName.includes(weak));
  }

  reportVulnerability(type, description) {
    this.vulnerabilities.push({
      type,
      description,
      timestamp: this.timestamp,
      user: this.user
    });
  }

  analyzeResults(results) {
    return {
      timestamp: this.timestamp,
      user: this.user,
      results,
      vulnerabilities: this.vulnerabilities,
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length
      }
    };
  }
}

export default new NetworkSecurityTest();