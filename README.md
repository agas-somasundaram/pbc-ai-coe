# PBC AI Center of Excellence - Security Framework Demo

> **A demonstration project showcasing AI-assisted development with integrated security scanning**

## 🎯 Project Overview

This repository serves dual purposes:

1. **Demo Application**: A React-based fitness tracker with intentional security vulnerabilities for educational purposes
2. **Security Framework**: A reusable security scanning framework that can be integrated into ANY JavaScript/TypeScript codebase

## 🏗️ Project Structure

```
pbc-ai-coe/
├── fitness-tracker/              # Demo app with intentional vulnerabilities
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
│
├── security-scanner/             # 🔒 Reusable Security Framework
│   ├── src/
│   │   ├── core/                # Scanner engine & reporter
│   │   ├── rules/               # Rule system (12 built-in rules)
│   │   └── index.js             # Public API
│   ├── bin/scan                 # CLI tool
│   └── package.json
│
├── .windsurf/                    # Vibe Coding Rules
│   └── rules/                   # Security rules for AI coding
│       ├── 60-security-baseline.md
│       ├── 65-authentication-requirements.md
│       ├── 70-dependency-and-CVE-checks.md
│       ├── 80-secure-code-patterns.md
│       ├── 90-infra-secrets-policy.md
│       ├── 97-cia-triad-enforcement.md
│       └── 98-visible-security-failures.md
│
├── security-audit/               # Security scan reports
│   ├── security-report.md       # Markdown report
│   ├── security-report.html     # Visual HTML report
│   └── security-report.json     # Machine-readable report
│
├── security-scan.js              # Project-specific scanner
└── .securityrc.json              # Security scanner config
```

## 🤖 How Vibe Coding Works with This Framework

### What is Vibe Coding?

**Vibe Coding** is AI-assisted development where the AI coding assistant (like Cascade/Windsurf) follows predefined security rules to ensure secure code generation.

### The Workflow

```
Developer Request
    ↓
AI Assistant (Cascade) reads .windsurf/rules/
    ↓
Generates code following security rules
    ↓
Automatically runs security-scan.js
    ↓
Findings logged to security-audit/
    ↓
Reports generated (MD, HTML, JSON)
    ↓
Developer reviews and approves
```

### Security Rules Integration

The `.windsurf/rules/` directory contains security policies that:

1. **Guide AI Code Generation**: AI assistant follows these rules when writing code
2. **Define Security Standards**: CIA Triad, OWASP Top 10, secure patterns
3. **Enable Automated Scanning**: Rules are enforced by the security scanner
4. **Track Compliance**: All findings mapped to specific rules

### Example: AI Following Rules

When you ask the AI to add a new feature:

```
You: "Add a login form to the app"

AI (Cascade):
1. Reads RULE-65 (Authentication Requirements)
2. Reads RULE-80 (Secure Code Patterns - CSRF, XSS)
3. Generates code with:
   ✅ CSRF protection
   ✅ Input validation
   ✅ Secure password handling
4. Runs security scan automatically
5. Reports any issues found
```

## 🔒 Security Framework Features

### Built-in Security Rules (12 Total)

| Rule ID | Name | Severity | What It Detects |
|---------|------|----------|-----------------|
| RULE-90 | Hardcoded Credentials | 🔴 Critical | Secrets in code |
| RULE-80-SQL | SQL Injection | 🔴 Critical | SQL injection risks |
| RULE-80-XSS | XSS Vulnerability | 🔴 Critical | Cross-site scripting |
| RULE-65 | Missing Authentication | 🔴 Critical | Unprotected routes |
| RULE-80-CSRF | Missing CSRF Protection | 🟠 High | CSRF vulnerabilities |
| RULE-80-INPUT | Missing Input Validation | 🟠 High | Unvalidated inputs |
| RULE-80-EVAL | Unsafe Code Execution | 🔴 Critical | eval() usage |
| RULE-90-LOGS | Secret Exposure in Logs | 🟠 High | Secrets in logs |
| RULE-80-RANDOM | Insecure Randomness | 🟡 Medium | Math.random() |
| RULE-97-RATE | Missing Rate Limiting | 🟠 High | No rate limits |
| RULE-97-HTTPS | Missing HTTPS | 🟠 High | HTTP usage |
| RULE-60-DEBUG | Debug Statements | 🔵 Low | console.log() |

### CIA Triad Enforcement

All rules map to the CIA Triad:
- **Confidentiality**: Protect sensitive data (secrets, credentials, PHI)
- **Integrity**: Prevent data tampering (SQL injection, XSS, CSRF)
- **Availability**: Ensure system uptime (rate limiting, DoS prevention)

## 🚀 Quick Start

### 1. Run the Demo App

```bash
cd fitness-tracker
npm install
npm run dev
```

Visit `http://localhost:5173`

### 2. Run Security Scan

```bash
# From project root
node security-scan.js
```

### 3. View Security Reports

- **HTML Report**: Open `security-audit/security-report.html` in browser
- **Markdown Report**: View `security-audit/security-report.md`
- **JSON Report**: `security-audit/security-report.json` for CI/CD

### 4. Use Framework in Other Projects

```bash
# Install the framework
npm install ./security-scanner

# Initialize in your project
npx security-scan --init

# Run scan
npm run security
```

## 📊 Demo App: Intentional Vulnerabilities

⚠️ **Important**: The fitness-tracker app contains **intentional security vulnerabilities** for demonstration purposes. Do NOT use this code in production!

### Current Vulnerabilities (By Design)

1. **Missing Authentication** (RULE-65)
   - Routes are not protected
   - No login/logout functionality
   - Anyone can access all pages

2. **Debug Statements** (RULE-60-DEBUG)
   - console.log() statements in production code
   - Potential information disclosure

These vulnerabilities are detected and reported by the security scanner.

## 🎓 Educational Use Cases

### 1. Learning Secure Coding

```bash
# See what security issues exist
node security-scan.js

# Review the HTML report
open security-audit/security-report.html

# Learn from recommendations
# Each finding includes:
# - What the issue is
# - Why it's a problem
# - How to fix it
# - Which rule it violates
```

### 2. Testing AI-Assisted Development

```bash
# Ask AI to add a feature
"Add a user registration form"

# AI follows security rules automatically
# Security scan runs after code generation
# Review findings in security-audit/
```

### 3. CI/CD Integration

```yaml
# .github/workflows/security.yml
- name: Security Scan
  run: node security-scan.js
  
- name: Upload Reports
  uses: actions/upload-artifact@v3
  with:
    name: security-reports
    path: security-audit/
```

## 🔧 Using the Security Framework

### In This Project

```bash
# Scan the fitness-tracker app
node security-scan.js
```

### In ANY Other Project

```bash
# Install framework
npm install /path/to/security-scanner

# Or publish to NPM first
cd security-scanner
npm publish
npm install @your-org/security-scanner

# Initialize
npx security-scan --init

# Configure .securityrc.json
{
  "include": ["src/**/*.{js,ts}"],
  "exclude": ["**/node_modules/**"],
  "rulesDir": ".security/rules"
}

# Run
npm run security
```

### Create Custom Rules

```javascript
// .security/rules/my-rule.js
const { BaseRule } = require('@your-org/security-scanner');

class MyCustomRule extends BaseRule {
  constructor() {
    super({
      id: 'CUSTOM-001',
      name: 'My Security Check',
      severity: 'high',
      description: 'Custom security pattern',
      recommendation: 'Fix according to guidelines'
    });
  }

  detect(content, filePath) {
    const findings = [];
    // Your detection logic
    return findings;
  }
}

module.exports = MyCustomRule;
```

## 📚 Documentation

- **[Security Framework README](./security-scanner/README.md)** - Framework documentation
- **[Integration Guide](./security-scanner/INTEGRATION-GUIDE.md)** - How to integrate into any project
- **[Framework Overview](./security-scanner/FRAMEWORK-OVERVIEW.md)** - Architecture and design
- **[Architecture](./security-scanner/ARCHITECTURE.md)** - Technical architecture
- **[Framework Comparison](./FRAMEWORK-COMPARISON.md)** - Before/after comparison
- **[Security Rules Integration](./SECURITY-RULES-INTEGRATION.md)** - How rules work
- **[Vibe Coding Workflow](./VIBE-CODING-SECURITY-WORKFLOW.md)** - AI-assisted development

## 🎯 Tech Stack

### Demo Application (fitness-tracker/)
- **Frontend**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **Charts**: Chart.js v4.4.0, React-ChartJS-2 v5.2.0

### Security Framework (security-scanner/)
- **Runtime**: Node.js 14+
- **Language**: JavaScript (ES6+)
- **CLI**: Commander.js
- **File Matching**: Glob patterns
- **Reporting**: Markdown, HTML, JSON

## 🤝 Our Mission

PBC's AI & Security Center of Excellence unites forward-thinking security leaders to explore, shape, and share best practices at the intersection of artificial intelligence and cybersecurity.

### Goals

1. **Illuminate Risks & Opportunities**: Identify and address the unique risks AI introduces to software, systems, and organizations; while enabling its responsible and secure adoption.

2. **Empower Security Leaders**: Equip security leaders with insights to navigate AI securely.

3. **Advance Collective Knowledge**: Build primers, best practices, and guidance materials through collaboration among leading practitioners.

4. **Influence the Future**: Champion the role of security leadership in ensuring AI-driven innovation is trustworthy and secure.

## 🔐 Security Best Practices

This project demonstrates:

✅ **Security Rules as Code**: `.windsurf/rules/` define security policies  
✅ **Automated Scanning**: Security checks run automatically  
✅ **CIA Triad Enforcement**: All rules map to Confidentiality, Integrity, Availability  
✅ **OWASP Compliance**: Rules based on OWASP Top 10  
✅ **CWE Mapping**: Findings mapped to Common Weakness Enumeration  
✅ **Comprehensive Reporting**: Multiple report formats for different audiences  
✅ **AI-Assisted Security**: AI follows security rules during code generation  

## 🚨 Important Notes

1. **Demo App Security**: The fitness-tracker app has intentional vulnerabilities. Do NOT use in production.

2. **Framework Reusability**: The security-scanner framework is production-ready and can be used in real projects.

3. **Vibe Coding**: This project showcases how AI assistants can follow security rules to generate secure code.

4. **Educational Purpose**: Use this project to learn about security scanning, AI-assisted development, and secure coding practices.

## 📞 Getting Help

- **Security Framework Issues**: See `security-scanner/README.md`
- **Integration Questions**: See `security-scanner/INTEGRATION-GUIDE.md`
- **Vibe Coding**: See `.windsurf/rules/` for security policies
- **Demo App**: This is intentionally vulnerable for educational purposes

## 🗺️ Roadmap

- [x] Security scanning framework
- [x] Vibe coding rules integration
- [x] Multi-format reporting
- [x] CIA Triad enforcement
- [ ] Auto-fix capabilities
- [ ] IDE extensions
- [ ] Dependency vulnerability scanning
- [ ] Machine learning-based detection

## 📄 License

MIT License - See LICENSE file for details

---

**Made with ❤️ for secure AI-assisted development**

