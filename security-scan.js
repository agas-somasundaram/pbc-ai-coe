const fs = require('fs');
const path = require('path');
const AuditLogger = require('./security-audit/audit-logger');

// Initialize audit logger
const auditLogger = new AuditLogger();

const securityIssues = [];

// Security patterns based on .windsurf/rules/ security rules
const securityPatterns = [
  // Rule 90: Infra-Secrets-Policy - Never hardcode secrets
  {
    name: 'Hardcoded Credentials',
    pattern: /(password|secret|api[_-]?key|token|pwd|passwd|auth|credential)[\s=:]+['"]\w+['"]/i,
    severity: '🔴 Critical',
    description: 'Hardcoded credentials found. Use environment variables instead.',
    ruleId: 'RULE-90',
    ruleName: 'Infra-Secrets-Policy',
    ciaImpact: 'Confidentiality',
    recommendation: 'Move secrets to environment variables or secure vault (e.g., AWS Secrets Manager, HashiCorp Vault)'
  },
  // Rule 80: Secure-Code-Patterns - SQL Injection
  {
    name: 'SQL Injection Risk',
    pattern: /(SELECT|INSERT|UPDATE|DELETE).*\+.*['"]\s*\+/i,
    severity: '🔴 Critical',
    description: 'Potential SQL injection vulnerability found. Use parameterized queries.',
    ruleId: 'RULE-80',
    ruleName: 'Secure-Code-Patterns',
    ciaImpact: 'Integrity, Confidentiality',
    recommendation: 'Use parameterized queries or ORM with proper escaping'
  },
  // Rule 80: Secure-Code-Patterns - XSS
  {
    name: 'XSS Vulnerability',
    pattern: /dangerouslySetInnerHTML|innerHTML\s*=|document\.write\(|eval\(/i,
    severity: '🔴 Critical',
    description: 'Potential XSS vulnerability. Use proper output encoding.',
    ruleId: 'RULE-80',
    ruleName: 'Secure-Code-Patterns',
    ciaImpact: 'Integrity, Confidentiality',
    recommendation: 'Sanitize all inputs and use safe rendering methods (e.g., textContent, DOMPurify)'
  },
  // Rule 65: Authentication-Requirements - Missing Authentication
  {
    name: 'Missing Authentication',
    pattern: /<Route.*element=.*\/>/,
    severity: '🔴 Critical',
    description: 'Route without authentication check. All routes handling user data must implement authentication.',
    ruleId: 'RULE-65',
    ruleName: 'Authentication-Requirements',
    ciaImpact: 'Confidentiality, Integrity, Availability',
    recommendation: 'Implement authentication using Auth0, Firebase Auth, or Passport.js. Wrap routes with authentication middleware.'
  },
  // Rule 80: Secure-Code-Patterns - CSRF
  {
    name: 'Missing CSRF Protection',
    pattern: /<form[^>]*method=['"]post['"][^>]*>/i,
    severity: '🟠 High',
    description: 'Form without CSRF protection detected.',
    ruleId: 'RULE-80',
    ruleName: 'Secure-Code-Patterns',
    ciaImpact: 'Integrity',
    recommendation: 'Implement CSRF tokens for all state-changing operations'
  },
  // Rule 80: Secure-Code-Patterns - Input Validation
  {
    name: 'Missing Input Validation',
    pattern: /req\.(body|query|params)\.\w+(?!.*validate)/i,
    severity: '🟠 High',
    description: 'User input used without validation.',
    ruleId: 'RULE-80',
    ruleName: 'Secure-Code-Patterns',
    ciaImpact: 'Integrity',
    recommendation: 'Validate all user inputs using validation libraries (e.g., Joi, Yup, express-validator)'
  },
  // Rule 80: Secure-Code-Patterns - Unsafe eval/exec
  {
    name: 'Unsafe Code Execution',
    pattern: /eval\(|Function\(|setTimeout\(['"]/i,
    severity: '🔴 Critical',
    description: 'Unsafe code execution pattern detected (eval, Function constructor).',
    ruleId: 'RULE-80',
    ruleName: 'Secure-Code-Patterns',
    ciaImpact: 'Integrity, Availability',
    recommendation: 'Avoid eval() and Function constructor. Use safe alternatives like JSON.parse()'
  },
  // Rule 90: Infra-Secrets-Policy - Secrets in logs
  {
    name: 'Potential Secret Exposure in Logs',
    pattern: /console\.(log|info|debug|warn)\(.*?(password|secret|token|key|credential)/i,
    severity: '🟠 High',
    description: 'Potential secret exposure in console logs.',
    ruleId: 'RULE-90',
    ruleName: 'Infra-Secrets-Policy',
    ciaImpact: 'Confidentiality',
    recommendation: 'Never log sensitive data. Use structured logging with secret redaction.'
  },
  // Rule 80: Secure-Code-Patterns - Insecure randomness
  {
    name: 'Insecure Randomness',
    pattern: /Math\.random\(\)/i,
    severity: '🟡 Medium',
    description: 'Math.random() is not cryptographically secure.',
    ruleId: 'RULE-80',
    ruleName: 'Secure-Code-Patterns',
    ciaImpact: 'Confidentiality',
    recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive operations'
  },
  // Rule 97: CIA-Triad - Rate Limiting
  {
    name: 'Missing Rate Limiting',
    pattern: /app\.(post|put|delete)\(['"]\/(api|auth)/i,
    severity: '🟠 High',
    description: 'API endpoint without rate limiting.',
    ruleId: 'RULE-97',
    ruleName: 'CIA-Triad-Enforcement',
    ciaImpact: 'Availability',
    recommendation: 'Implement rate limiting using express-rate-limit or similar middleware'
  },
  // Rule 60: Security-Baseline - Debug statements
  {
    name: 'Debug Statements',
    pattern: /console\.(log|warn|error|info|debug)\(/i,
    severity: '🔵 Low',
    description: 'Debug statements found in production code.',
    ruleId: 'RULE-60',
    ruleName: 'Security-Baseline',
    ciaImpact: 'Confidentiality',
    recommendation: 'Remove debug statements or use proper logging framework with log levels'
  },
  // Rule 97: CIA-Triad - HTTPS enforcement
  {
    name: 'Missing HTTPS Enforcement',
    pattern: /http:\/\//i,
    severity: '🟠 High',
    description: 'HTTP URL detected. HTTPS should be enforced.',
    ruleId: 'RULE-97',
    ruleName: 'CIA-Triad-Enforcement',
    ciaImpact: 'Confidentiality, Integrity',
    recommendation: 'Use HTTPS for all communications. Implement HSTS headers.'
  }
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    securityPatterns.forEach(pattern => {
      const matches = content.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        const issue = {
          file: filePath,
          issue: pattern.name,
          severity: pattern.severity,
          description: pattern.description,
          ruleId: pattern.ruleId,
          ruleName: pattern.ruleName,
          ciaImpact: pattern.ciaImpact,
          recommendation: pattern.recommendation,
          matches: matches.length,
          lines: []
        };
        
        // Find line numbers where the pattern matches
        lines.forEach((line, index) => {
          if (line.match(pattern.pattern)) {
            issue.lines.push({
              line: index + 1,
              content: line.trim()
            });
          }
        });
        
        securityIssues.push(issue);
      }
    });
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error);
  }
}

function scanDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-essential directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        scanDirectory(fullPath);
      }
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      scanFile(fullPath);
    }
  });
}

// Start scanning from the project root
const projectRoot = path.join(__dirname, 'fitness-tracker');
console.log(`🔍 Scanning for security issues in ${projectRoot}...\n`);

scanDirectory(projectRoot);

// Generate report and log findings
if (securityIssues.length === 0) {
  console.log('✅ No security issues found!');
  
  // Log successful scan with no findings
  auditLogger.logSecurityScanResults([]);
} else {
  console.log(`\n🔍 Found ${securityIssues.length} potential security issues. Logging findings...\n`);
  
  // Log to audit system (all rule information is already included in securityIssues)
  const scanReport = auditLogger.logSecurityScanResults(securityIssues);
  
  // Show summary to console
  console.log(`📊 Security scan completed.\n`);
  
  // Group by file for console output
  const issuesByFile = securityIssues.reduce((acc, issue) => {
    if (!acc[issue.file]) acc[issue.file] = [];
    acc[issue.file].push(issue);
    return acc;
  }, {});
  
  // Show summary of findings
  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.log(`📄 ${file}`);
    console.log('─'.repeat(process.stdout.columns || 80));
    
    issues.forEach(issue => {
      console.log(`  ${issue.severity} - ${issue.issue}`);
      console.log(`  ${issue.description}`);
      console.log(`  See audit log for details.`);
      console.log();
    });
  });
  
  // Show summary
  const summary = securityIssues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📊 Summary of Findings:');
  Object.entries(summary).forEach(([severity, count]) => {
    console.log(`  ${severity}: ${count} issue(s)`);
  });
  
  console.log('\n🔍 Detailed findings have been logged to the security audit system.');
  console.log(`📄 Markdown Report: ${scanReport.markdownReport}`);
  console.log(`📄 HTML Report: ${scanReport.htmlReport}`);
}
