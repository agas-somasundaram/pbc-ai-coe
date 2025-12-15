# Integration Guide

This guide shows you how to integrate the Security Scanner Framework into any codebase.

## Table of Contents

1. [Quick Integration](#quick-integration)
2. [Framework-Specific Integration](#framework-specific-integration)
3. [Custom Rules for Your Stack](#custom-rules-for-your-stack)
4. [CI/CD Integration](#cicd-integration)
5. [Team Workflow](#team-workflow)

---

## Quick Integration

### Step 1: Install

```bash
npm install --save-dev @your-org/security-scanner
```

### Step 2: Initialize

```bash
npx security-scan --init
```

This creates `.securityrc.json` in your project root.

### Step 3: Configure

Edit `.securityrc.json` to match your project structure:

```json
{
  "rulesDir": ".security/rules",
  "include": ["src/**/*.{js,jsx,ts,tsx}"],
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.test.{js,ts}"
  ],
  "reporter": {
    "outputDir": "./security-reports",
    "formats": ["html", "markdown"]
  }
}
```

### Step 4: Run

```bash
npx security-scan
```

---

## Framework-Specific Integration

### React Application

```json
{
  "include": [
    "src/**/*.{js,jsx,ts,tsx}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/*.test.{js,jsx,ts,tsx}",
    "**/build/**",
    "**/public/**"
  ],
  "rules": {
    "RULE-80-XSS": { "enabled": true, "severity": "critical" },
    "RULE-65": { "enabled": true, "severity": "critical" }
  }
}
```

**Custom React Rules:**

```javascript
// .security/rules/react-rules.js
const { BaseRule } = require('@your-org/security-scanner');

class UnsafeDangerouslySetInnerHTMLRule extends BaseRule {
  constructor() {
    super({
      id: 'REACT-001',
      name: 'Unsafe dangerouslySetInnerHTML',
      severity: 'critical',
      description: 'dangerouslySetInnerHTML without sanitization',
      recommendation: 'Use DOMPurify to sanitize HTML before rendering',
      pattern: /dangerouslySetInnerHTML={{__html:/,
      metadata: {
        category: 'react-security',
        ciaImpact: 'Integrity, Confidentiality'
      }
    });
  }
}

module.exports = UnsafeDangerouslySetInnerHTMLRule;
```

### Node.js/Express Backend

```json
{
  "include": [
    "src/**/*.js",
    "routes/**/*.js",
    "controllers/**/*.js"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/*.test.js"
  ],
  "rules": {
    "RULE-80-SQL": { "enabled": true },
    "RULE-80-INPUT": { "enabled": true },
    "RULE-97-RATE": { "enabled": true }
  }
}
```

**Custom Express Rules:**

```javascript
// .security/rules/express-rules.js
const { BaseRule } = require('@your-org/security-scanner');

class MissingHelmetMiddlewareRule extends BaseRule {
  constructor() {
    super({
      id: 'EXPRESS-001',
      name: 'Missing Helmet Middleware',
      severity: 'high',
      description: 'Express app without Helmet security headers',
      recommendation: 'Add helmet() middleware: app.use(helmet())',
      metadata: {
        category: 'express-security',
        ciaImpact: 'Confidentiality, Integrity'
      }
    });
  }

  detect(content, filePath) {
    if (!filePath.includes('server') && !filePath.includes('app')) {
      return [];
    }

    const hasExpress = /require\(['"]express['"]\)/.test(content);
    const hasHelmet = /helmet\(\)/.test(content);

    if (hasExpress && !hasHelmet) {
      return [{
        line: 1,
        match: 'Missing helmet middleware'
      }];
    }

    return [];
  }
}

module.exports = MissingHelmetMiddlewareRule;
```

### Next.js Application

```json
{
  "include": [
    "pages/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,ts}",
    "api/**/*.{js,ts}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/.next/**",
    "**/out/**"
  ]
}
```

### Vue.js Application

```json
{
  "include": [
    "src/**/*.{js,ts,vue}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/dist/**"
  ]
}
```

**Note:** For `.vue` files, you'll need to add a custom parser.

### Angular Application

```json
{
  "include": [
    "src/**/*.{ts,html}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.spec.ts"
  ]
}
```

---

## Custom Rules for Your Stack

### Database Security Rules

```javascript
// .security/rules/database-rules.js
const { BaseRule } = require('@your-org/security-scanner');

class MongoDBInjectionRule extends BaseRule {
  constructor() {
    super({
      id: 'DB-MONGO-001',
      name: 'MongoDB Injection Risk',
      severity: 'critical',
      description: 'Potential MongoDB injection vulnerability',
      recommendation: 'Use parameterized queries or mongoose with schema validation',
      metadata: {
        category: 'database',
        ciaImpact: 'Integrity, Confidentiality',
        owasp: 'A03:2021'
      }
    });
  }

  detect(content, filePath) {
    const findings = [];
    const dangerousPatterns = [
      /db\.collection\([^)]+\)\.find\({[^}]*\$where/,
      /Model\.find\({[^}]*\$where/,
      /\.where\([^)]*req\.(body|query|params)/
    ];

    dangerousPatterns.forEach(pattern => {
      const matches = content.matchAll(new RegExp(pattern, 'g'));
      for (const match of matches) {
        findings.push({
          line: this.getLineNumber(content, match.index),
          match: match[0]
        });
      }
    });

    return findings;
  }
}

module.exports = MongoDBInjectionRule;
```

### API Security Rules

```javascript
// .security/rules/api-rules.js
const { BaseRule } = require('@your-org/security-scanner');

class MissingCorsConfigRule extends BaseRule {
  constructor() {
    super({
      id: 'API-001',
      name: 'Missing or Insecure CORS Configuration',
      severity: 'high',
      description: 'CORS configured with wildcard or missing',
      recommendation: 'Configure CORS with specific origins',
      metadata: {
        category: 'api-security',
        ciaImpact: 'Integrity'
      }
    });
  }

  detect(content, filePath) {
    const findings = [];
    
    // Check for wildcard CORS
    if (/cors\(\{[^}]*origin:\s*['"]?\*['"]?/.test(content)) {
      findings.push({
        line: this.getLineNumber(content, content.indexOf('origin:')),
        match: 'Wildcard CORS origin'
      });
    }

    return findings;
  }
}

module.exports = MissingCorsConfigRule;
```

### Authentication Rules

```javascript
// .security/rules/auth-rules.js
const { BaseRule } = require('@your-org/security-scanner');

class WeakPasswordPolicyRule extends BaseRule {
  constructor() {
    super({
      id: 'AUTH-001',
      name: 'Weak Password Policy',
      severity: 'high',
      description: 'Password validation is too weak',
      recommendation: 'Enforce strong password policy: min 12 chars, uppercase, lowercase, numbers, special chars',
      metadata: {
        category: 'authentication',
        ciaImpact: 'Confidentiality'
      }
    });
  }

  detect(content, filePath) {
    const findings = [];
    
    // Look for password validation
    const passwordRegex = /password.*length.*[<>=]{1,2}\s*(\d+)/gi;
    const matches = content.matchAll(passwordRegex);
    
    for (const match of matches) {
      const length = parseInt(match[1]);
      if (length < 12) {
        findings.push({
          line: this.getLineNumber(content, match.index),
          match: match[0],
          metadata: { minLength: length }
        });
      }
    }

    return findings;
  }

  getDescription(match) {
    return `Password minimum length of ${match.metadata.minLength} is too weak`;
  }
}

module.exports = WeakPasswordPolicyRule;
```

---

## CI/CD Integration

### GitHub Actions (Complete Example)

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0' # Weekly scan

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security scan
        run: npm run security:ci
        continue-on-error: true
      
      - name: Upload security reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: security-reports
          path: security-audit/
          retention-days: 30
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(
              fs.readFileSync('security-audit/security-report.json', 'utf8')
            );
            
            const body = `## 🔒 Security Scan Results
            
            **Total Issues:** ${report.summary.total}
            
            ${Object.entries(report.summary.bySeverity)
              .map(([severity, count]) => `- **${severity}:** ${count}`)
              .join('\n')}
            
            [View detailed report](../actions/runs/${context.runId})
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
      
      - name: Fail on critical issues
        run: |
          CRITICAL=$(jq '.summary.bySeverity.critical // 0' security-audit/security-report.json)
          if [ "$CRITICAL" -gt 0 ]; then
            echo "❌ Found $CRITICAL critical security issues"
            exit 1
          fi
```

### GitLab CI (Complete Example)

```yaml
# .gitlab-ci.yml
stages:
  - test
  - security
  - report

security_scan:
  stage: security
  image: node:18
  script:
    - npm ci
    - npm run security:ci
  artifacts:
    when: always
    paths:
      - security-audit/
    reports:
      junit: security-audit/junit-report.xml
  allow_failure: false
  only:
    - merge_requests
    - main
    - develop

security_report:
  stage: report
  image: node:18
  script:
    - npm ci
    - npm run security -- --html --markdown
  artifacts:
    paths:
      - security-audit/
    expire_in: 30 days
  only:
    - schedules
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'npm run security:ci'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'security-audit/**/*', allowEmptyArchive: true
                    publishHTML([
                        reportDir: 'security-audit',
                        reportFiles: 'security-report.html',
                        reportName: 'Security Report'
                    ])
                }
            }
        }
        
        stage('Check Results') {
            steps {
                script {
                    def report = readJSON file: 'security-audit/security-report.json'
                    def critical = report.summary.bySeverity.critical ?: 0
                    
                    if (critical > 0) {
                        error("Found ${critical} critical security issues")
                    }
                }
            }
        }
    }
}
```

---

## Team Workflow

### 1. Pre-commit Hook (Husky)

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run security:quick"
```

```json
// package.json
{
  "scripts": {
    "security:quick": "security-scan --format minimal --exit-code"
  }
}
```

### 2. Developer Workflow

```bash
# Before committing
npm run security

# Fix critical issues
# Review report: security-audit/security-report.html

# Commit
git add .
git commit -m "feat: add new feature"
```

### 3. Code Review Checklist

- [ ] Security scan passes
- [ ] No new critical or high severity issues
- [ ] Existing issues documented with justification
- [ ] Security report reviewed

### 4. Release Process

```bash
# Pre-release security audit
npm run security -- --html --markdown

# Review comprehensive report
open security-audit/security-report.html

# Document any accepted risks
# Tag release
git tag v1.0.0
```

---

## Advanced Configuration

### Multi-Project Monorepo

```json
// .securityrc.json (root)
{
  "projects": [
    {
      "name": "frontend",
      "rootDir": "./packages/frontend",
      "include": ["src/**/*.{js,jsx,ts,tsx}"],
      "rulesDir": "./packages/frontend/.security/rules"
    },
    {
      "name": "backend",
      "rootDir": "./packages/backend",
      "include": ["src/**/*.js"],
      "rulesDir": "./packages/backend/.security/rules"
    }
  ]
}
```

### Severity Thresholds

```javascript
// scripts/security-check.js
const { scan } = require('@your-org/security-scanner');

async function checkSecurity() {
  const results = await scan();
  
  const thresholds = {
    critical: 0,  // No critical issues allowed
    high: 5,      // Max 5 high severity
    medium: 20    // Max 20 medium severity
  };
  
  let failed = false;
  
  Object.entries(thresholds).forEach(([severity, max]) => {
    const count = results.summary.bySeverity[severity] || 0;
    if (count > max) {
      console.error(`❌ ${severity}: ${count} (max: ${max})`);
      failed = true;
    }
  });
  
  if (failed) process.exit(1);
}

checkSecurity();
```

---

## Troubleshooting

### Issue: Too many false positives

**Solution:** Create custom rules or adjust existing ones

```javascript
// Extend default rule with custom logic
const { BaseRule } = require('@your-org/security-scanner');
const DefaultRule = require('@your-org/security-scanner/rules/default-rules');

class CustomXSSRule extends DefaultRule.XssVulnerabilityRule {
  detect(content, filePath) {
    // Skip test files
    if (filePath.includes('.test.')) return [];
    
    // Call parent detection
    const findings = super.detect(content, filePath);
    
    // Filter out known safe patterns
    return findings.filter(f => !this.isSafePattern(f));
  }
  
  isSafePattern(finding) {
    // Your custom logic
    return false;
  }
}
```

### Issue: Scan is too slow

**Solution:** Optimize file patterns

```json
{
  "include": ["src/**/*.{js,ts}"],
  "exclude": [
    "**/node_modules/**",
    "**/*.min.js",
    "**/vendor/**",
    "**/dist/**"
  ]
}
```

---

## Next Steps

1. ✅ Install the scanner
2. ✅ Configure for your project
3. ✅ Create custom rules
4. ✅ Integrate with CI/CD
5. ✅ Train your team
6. ✅ Monitor and improve

**Happy Secure Coding! 🔒**
