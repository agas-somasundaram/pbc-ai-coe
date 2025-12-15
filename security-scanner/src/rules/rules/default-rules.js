const { BaseRule } = require('../base-rule');

/**
 * Default security rules that ship with the framework
 * These can be overridden or extended by users
 */

class HardcodedSecretsRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-90',
      name: 'Hardcoded Credentials',
      severity: 'critical',
      description: 'Hardcoded credentials found. Use environment variables instead.',
      recommendation: 'Move secrets to environment variables or secure vault (e.g., AWS Secrets Manager, HashiCorp Vault)',
      pattern: /(password|secret|api[_-]?key|token|pwd|passwd|auth|credential)[\s=:]+['"]\w+['"]/i,
      metadata: {
        category: 'secrets',
        ciaImpact: 'Confidentiality',
        owasp: 'A02:2021 – Cryptographic Failures',
        cwe: 'CWE-798: Use of Hard-coded Credentials'
      }
    });
  }
}

class SqlInjectionRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-80-SQL',
      name: 'SQL Injection Risk',
      severity: 'critical',
      description: 'Potential SQL injection vulnerability found. Use parameterized queries.',
      recommendation: 'Use parameterized queries or ORM with proper escaping',
      pattern: /(SELECT|INSERT|UPDATE|DELETE).*\+.*['"]\s*\+/i,
      metadata: {
        category: 'injection',
        ciaImpact: 'Integrity, Confidentiality',
        owasp: 'A03:2021 – Injection',
        cwe: 'CWE-89: SQL Injection'
      }
    });
  }
}

class XssVulnerabilityRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-80-XSS',
      name: 'XSS Vulnerability',
      severity: 'critical',
      description: 'Potential XSS vulnerability. Use proper output encoding.',
      recommendation: 'Sanitize all inputs and use safe rendering methods (e.g., textContent, DOMPurify)',
      pattern: /dangerouslySetInnerHTML|innerHTML\s*=|document\.write\(|eval\(/i,
      metadata: {
        category: 'injection',
        ciaImpact: 'Integrity, Confidentiality',
        owasp: 'A03:2021 – Injection',
        cwe: 'CWE-79: Cross-site Scripting (XSS)'
      }
    });
  }
}

class MissingAuthenticationRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-65',
      name: 'Missing Authentication',
      severity: 'critical',
      description: 'Route without authentication check. All routes handling user data must implement authentication.',
      recommendation: 'Implement authentication using Auth0, Firebase Auth, or Passport.js. Wrap routes with authentication middleware.',
      pattern: /<Route.*element=.*\/>/,
      metadata: {
        category: 'authentication',
        ciaImpact: 'Confidentiality, Integrity, Availability',
        owasp: 'A07:2021 – Identification and Authentication Failures',
        cwe: 'CWE-306: Missing Authentication for Critical Function'
      }
    });
  }
  
  appliesTo(filePath) {
    return /\.(jsx|tsx)$/.test(filePath);
  }
}

class CsrfProtectionRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-80-CSRF',
      name: 'Missing CSRF Protection',
      severity: 'high',
      description: 'Form without CSRF protection detected.',
      recommendation: 'Implement CSRF tokens for all state-changing operations',
      pattern: /<form[^>]*method=['"]post['"][^>]*>/i,
      metadata: {
        category: 'csrf',
        ciaImpact: 'Integrity',
        owasp: 'A01:2021 – Broken Access Control',
        cwe: 'CWE-352: Cross-Site Request Forgery (CSRF)'
      }
    });
  }
  
  appliesTo(filePath) {
    return /\.(jsx|tsx|html)$/.test(filePath);
  }
}

class InputValidationRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-80-INPUT',
      name: 'Missing Input Validation',
      severity: 'high',
      description: 'User input used without validation.',
      recommendation: 'Validate all user inputs using validation libraries (e.g., Joi, Yup, express-validator)',
      pattern: /req\.(body|query|params)\.\w+(?!.*validate)/i,
      metadata: {
        category: 'validation',
        ciaImpact: 'Integrity',
        owasp: 'A03:2021 – Injection',
        cwe: 'CWE-20: Improper Input Validation'
      }
    });
  }
  
  appliesTo(filePath) {
    return /\.(js|ts)$/.test(filePath) && !filePath.includes('.test.');
  }
}

class UnsafeCodeExecutionRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-80-EVAL',
      name: 'Unsafe Code Execution',
      severity: 'critical',
      description: 'Unsafe code execution pattern detected (eval, Function constructor).',
      recommendation: 'Avoid eval() and Function constructor. Use safe alternatives like JSON.parse()',
      pattern: /eval\(|Function\(|setTimeout\(['"]/i,
      metadata: {
        category: 'code-execution',
        ciaImpact: 'Integrity, Availability',
        owasp: 'A03:2021 – Injection',
        cwe: 'CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code'
      }
    });
  }
}

class SecretExposureInLogsRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-90-LOGS',
      name: 'Potential Secret Exposure in Logs',
      severity: 'high',
      description: 'Potential secret exposure in console logs.',
      recommendation: 'Never log sensitive data. Use structured logging with secret redaction.',
      pattern: /console\.(log|info|debug|warn)\(.*?(password|secret|token|key|credential)/i,
      metadata: {
        category: 'secrets',
        ciaImpact: 'Confidentiality',
        owasp: 'A02:2021 – Cryptographic Failures',
        cwe: 'CWE-532: Insertion of Sensitive Information into Log File'
      }
    });
  }
}

class InsecureRandomnessRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-80-RANDOM',
      name: 'Insecure Randomness',
      severity: 'medium',
      description: 'Math.random() is not cryptographically secure.',
      recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive operations',
      pattern: /Math\.random\(\)/i,
      metadata: {
        category: 'cryptography',
        ciaImpact: 'Confidentiality',
        owasp: 'A02:2021 – Cryptographic Failures',
        cwe: 'CWE-330: Use of Insufficiently Random Values'
      }
    });
  }
}

class MissingRateLimitingRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-97-RATE',
      name: 'Missing Rate Limiting',
      severity: 'high',
      description: 'API endpoint without rate limiting.',
      recommendation: 'Implement rate limiting using express-rate-limit or similar middleware',
      pattern: /app\.(post|put|delete)\(['"]\/(api|auth)/i,
      metadata: {
        category: 'availability',
        ciaImpact: 'Availability',
        owasp: 'A04:2021 – Insecure Design',
        cwe: 'CWE-770: Allocation of Resources Without Limits or Throttling'
      }
    });
  }
  
  appliesTo(filePath) {
    return /\.(js|ts)$/.test(filePath) && (filePath.includes('server') || filePath.includes('route'));
  }
}

class HttpsEnforcementRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-97-HTTPS',
      name: 'Missing HTTPS Enforcement',
      severity: 'high',
      description: 'HTTP URL detected. HTTPS should be enforced.',
      recommendation: 'Use HTTPS for all communications. Implement HSTS headers.',
      pattern: /http:\/\//i,
      metadata: {
        category: 'transport',
        ciaImpact: 'Confidentiality, Integrity',
        owasp: 'A02:2021 – Cryptographic Failures',
        cwe: 'CWE-319: Cleartext Transmission of Sensitive Information'
      }
    });
  }
}

class DebugStatementsRule extends BaseRule {
  constructor() {
    super({
      id: 'RULE-60-DEBUG',
      name: 'Debug Statements',
      severity: 'low',
      description: 'Debug statements found in production code.',
      recommendation: 'Remove debug statements or use proper logging framework with log levels',
      pattern: /console\.(log|warn|error|info|debug)\(/i,
      metadata: {
        category: 'code-quality',
        ciaImpact: 'Confidentiality',
        owasp: 'A05:2021 – Security Misconfiguration',
        cwe: 'CWE-489: Active Debug Code'
      }
    });
  }
}

// Export all rules
module.exports = [
  HardcodedSecretsRule,
  SqlInjectionRule,
  XssVulnerabilityRule,
  MissingAuthenticationRule,
  CsrfProtectionRule,
  InputValidationRule,
  UnsafeCodeExecutionRule,
  SecretExposureInLogsRule,
  InsecureRandomnessRule,
  MissingRateLimitingRule,
  HttpsEnforcementRule,
  DebugStatementsRule
];
