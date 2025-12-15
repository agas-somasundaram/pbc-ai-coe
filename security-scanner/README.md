# Security Scanner Framework

A flexible, extensible security scanning framework for JavaScript/TypeScript codebases. Built to be reusable across any project with customizable rules and comprehensive reporting.

## 🚀 Features

- **🔍 Rule-Based Scanning**: Extensible rule system with 12+ built-in security rules
- **📊 Multiple Report Formats**: Markdown, HTML, and JSON reports
- **⚙️ Highly Configurable**: Customize via CLI, config file, or programmatically
- **🎯 CIA Triad Enforcement**: Maps findings to Confidentiality, Integrity, Availability
- **📦 Framework Agnostic**: Works with any JavaScript/TypeScript codebase
- **🔌 Extensible**: Easy to add custom rules for your specific needs
- **🎨 Beautiful Reports**: Color-coded, responsive HTML reports for stakeholders

## 📦 Installation

### As a Package (Recommended)

```bash
npm install --save-dev @your-org/security-scanner
```

### From Source

```bash
git clone <repository-url>
cd security-scanner
npm install
npm link
```

## 🏃 Quick Start

### 1. Initialize in Your Project

```bash
cd your-project
npx security-scan --init
```

This creates a `.securityrc.json` configuration file.

### 2. Run Your First Scan

```bash
npx security-scan
```

### 3. View Reports

- **HTML Report**: Open `security-audit/security-report.html` in your browser
- **Markdown Report**: View `security-audit/security-report.md`
- **JSON Report**: `security-audit/security-report.json`

## 📖 Usage

### Command Line Interface

```bash
# Basic scan
security-scan

# Scan specific directory
security-scan --root ./src

# Use custom rules directory
security-scan --rules-dir ./custom-rules

# Generate specific report formats
security-scan --html --markdown --output ./reports/scan.json

# Exit with error code if issues found (for CI/CD)
security-scan --exit-code

# Debug mode
security-scan --debug
```

### Programmatic Usage

```javascript
const { scan, createScanner } = require('@your-org/security-scanner');

// Simple scan
async function quickScan() {
  const results = await scan({
    rootDir: './src',
    rulesDir: './security/rules'
  });
  
  console.log(`Found ${results.findings.length} issues`);
}

// Advanced usage with custom scanner
async function advancedScan() {
  const scanner = await createScanner({
    rootDir: process.cwd(),
    include: ['src/**/*.{js,ts}'],
    exclude: ['**/*.test.js'],
    logger: { level: 'debug' }
  });
  
  const results = await scanner.scan();
  
  // Custom processing
  const criticalIssues = results.findings.filter(
    f => f.severity === 'critical'
  );
  
  if (criticalIssues.length > 0) {
    console.error('Critical security issues found!');
    process.exit(1);
  }
}
```

### NPM Scripts Integration

Add to your `package.json`:

```json
{
  "scripts": {
    "security": "security-scan",
    "security:ci": "security-scan --exit-code --format json",
    "security:report": "security-scan --html --markdown",
    "precommit": "npm run security"
  }
}
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run security:ci
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: security-report
          path: security-audit/
```

#### GitLab CI

```yaml
security_scan:
  stage: test
  script:
    - npm install
    - npm run security:ci
  artifacts:
    when: always
    paths:
      - security-audit/
```

## ⚙️ Configuration

### Configuration File (.securityrc.json)

```json
{
  "rulesDir": ".windsurf/rules",
  "include": ["**/*.{js,jsx,ts,tsx}"],
  "exclude": ["**/node_modules/**", "**/dist/**"],
  "scanOptions": {
    "severity": ["critical", "high", "medium", "low"]
  },
  "reporter": {
    "outputDir": "./security-audit",
    "formats": ["markdown", "html", "json"]
  },
  "rules": {
    "RULE-90": { "enabled": true, "severity": "critical" },
    "RULE-80-SQL": { "enabled": true, "severity": "critical" }
  }
}
```

### Environment Variables

```bash
LOG_LEVEL=debug security-scan
SECURITY_RULES_DIR=./custom-rules security-scan
```

## 🛡️ Built-in Security Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| RULE-90 | Hardcoded Credentials | Critical | Detects hardcoded secrets |
| RULE-80-SQL | SQL Injection | Critical | Detects SQL injection risks |
| RULE-80-XSS | XSS Vulnerability | Critical | Detects XSS vulnerabilities |
| RULE-65 | Missing Authentication | Critical | Detects unprotected routes |
| RULE-80-CSRF | Missing CSRF Protection | High | Detects missing CSRF tokens |
| RULE-80-INPUT | Missing Input Validation | High | Detects unvalidated inputs |
| RULE-80-EVAL | Unsafe Code Execution | Critical | Detects eval() usage |
| RULE-90-LOGS | Secret Exposure in Logs | High | Detects secrets in logs |
| RULE-80-RANDOM | Insecure Randomness | Medium | Detects Math.random() |
| RULE-97-RATE | Missing Rate Limiting | High | Detects missing rate limits |
| RULE-97-HTTPS | Missing HTTPS | High | Detects HTTP usage |
| RULE-60-DEBUG | Debug Statements | Low | Detects console.log() |

## 🎨 Creating Custom Rules

### Simple Rule (Object Definition)

Create `custom-rules/my-rule.js`:

```javascript
module.exports = {
  id: 'CUSTOM-001',
  name: 'Deprecated API Usage',
  severity: 'medium',
  description: 'Usage of deprecated API detected',
  recommendation: 'Update to the new API',
  pattern: /oldDeprecatedFunction\(/i,
  metadata: {
    category: 'deprecation',
    ciaImpact: 'Availability'
  }
};
```

### Advanced Rule (Class Definition)

```javascript
const { BaseRule } = require('@your-org/security-scanner');

class CustomSecurityRule extends BaseRule {
  constructor() {
    super({
      id: 'CUSTOM-002',
      name: 'Custom Security Check',
      severity: 'high',
      description: 'Custom security pattern detected',
      recommendation: 'Fix the security issue',
      metadata: {
        category: 'custom',
        ciaImpact: 'Confidentiality',
        owasp: 'A01:2021',
        cwe: 'CWE-123'
      }
    });
  }

  // Override detection logic
  detect(content, filePath) {
    const findings = [];
    
    // Custom detection logic
    if (content.includes('dangerousPattern')) {
      findings.push({
        line: this.getLineNumber(content, content.indexOf('dangerousPattern')),
        match: 'dangerousPattern',
        metadata: { customData: 'value' }
      });
    }
    
    return findings;
  }

  // Override to apply only to specific files
  appliesTo(filePath) {
    return /\.(js|ts)$/.test(filePath);
  }

  // Dynamic descriptions based on match
  getDescription(match) {
    return `Found dangerous pattern: ${match.match}`;
  }

  // Dynamic recommendations
  getRecommendation(match) {
    return `Replace ${match.match} with safe alternative`;
  }
}

module.exports = CustomSecurityRule;
```

### Using Custom Rules

```bash
security-scan --rules-dir ./custom-rules
```

Or in `.securityrc.json`:

```json
{
  "rulesDir": "./custom-rules"
}
```

## 📊 Report Examples

### Console Output

```
🔍 Security Scan Results

  Critical (2)  High (5)  Medium (3)  Low (1)

  ✗ Hardcoded Credentials (RULE-90)
    Severity: 🔴 Critical
    Files: 2
    - src/config/database.js:12
    - scripts/deploy.js:8

  ✗ SQL Injection (RULE-80-SQL)
    Severity: 🔴 Critical
    Files: 1
    - src/routes/users.js:42
```

### JSON Output

```json
{
  "summary": {
    "total": 11,
    "bySeverity": {
      "critical": 2,
      "high": 5,
      "medium": 3,
      "low": 1
    },
    "byRule": {
      "RULE-90 - Hardcoded Credentials": 2,
      "RULE-80-SQL - SQL Injection": 1
    }
  },
  "findings": [
    {
      "ruleId": "RULE-90",
      "ruleName": "Hardcoded Credentials",
      "severity": "critical",
      "description": "Hardcoded credentials found",
      "recommendation": "Move to environment variables",
      "file": "src/config/database.js",
      "lines": [
        { "line": 12, "content": "password: 'secret123'", "isMatch": true }
      ],
      "metadata": {
        "ciaImpact": "Confidentiality",
        "owasp": "A02:2021",
        "cwe": "CWE-798"
      }
    }
  ]
}
```

## 🔧 API Reference

### scan(options)

Runs a security scan with the provided options.

**Parameters:**
- `options.rootDir` (string): Root directory to scan
- `options.rulesDir` (string): Custom rules directory
- `options.include` (string[]): File patterns to include
- `options.exclude` (string[]): File patterns to exclude
- `options.logger` (object): Logger configuration

**Returns:** Promise<ScanResults>

### createScanner(options)

Creates a scanner instance for advanced usage.

**Returns:** Promise<SecurityScanner>

### BaseRule

Base class for creating custom rules.

**Methods:**
- `detect(content, filePath)`: Detection logic
- `appliesTo(filePath)`: File filtering
- `getDescription(match)`: Dynamic descriptions
- `getRecommendation(match)`: Dynamic recommendations

## 🎯 Use Cases

### 1. Pre-commit Hook

```bash
#!/bin/sh
npm run security || exit 1
```

### 2. Pull Request Checks

Automatically scan PRs and comment with findings.

### 3. Continuous Monitoring

Schedule daily scans and track security trends.

### 4. Security Audits

Generate comprehensive reports for compliance.

### 5. Developer Education

Help developers learn secure coding practices.

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-rule`)
3. Commit your changes (`git commit -m 'Add amazing security rule'`)
4. Push to the branch (`git push origin feature/amazing-rule`)
5. Open a Pull Request

### Development Setup

```bash
git clone <repository-url>
cd security-scanner
npm install
npm test
npm run lint
```

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OWASP Top 10
- CWE/SANS Top 25
- Security community best practices

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/security-scanner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/security-scanner/discussions)
- **Email**: security@your-org.com

## 🗺️ Roadmap

- [ ] Auto-fix capabilities
- [ ] IDE integrations (VS Code, IntelliJ)
- [ ] Machine learning-based detection
- [ ] Dependency vulnerability scanning
- [ ] SARIF format support
- [ ] More language support (Python, Java, Go)

---

**Made with ❤️ for secure coding**
