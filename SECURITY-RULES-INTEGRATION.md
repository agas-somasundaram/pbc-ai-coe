# Security Rules Integration

## Overview
The security scanner is now fully integrated with the Windsurf security rules defined in `.windsurf/rules/`. All security findings are mapped to specific rules and include comprehensive information for remediation.

## Rule Mapping

### Active Security Rules
The scanner enforces the following security rules:

| Rule ID | Rule Name | File | Description |
|---------|-----------|------|-------------|
| RULE-60 | Security-Baseline | `60-security-baseline.md` | Secure-by-default behavior, least privilege |
| RULE-65 | Authentication-Requirements | `65-authentication-requirements.md` | Mandatory authentication for all user data |
| RULE-70 | Dependency-CVE-Checks | `70-dependency-and-CVE-checks.md` | Check dependencies for known CVEs |
| RULE-80 | Secure-Code-Patterns | `80-secure-code-patterns.md` | Identify SQLi, XSS, CSRF, unsafe patterns |
| RULE-90 | Infra-Secrets-Policy | `90-infra-secrets-policy.md` | Never hardcode secrets |
| RULE-95 | Security-Super-Rule | `95-security-super-rule.md` | Master rule binding all security rules |
| RULE-97 | CIA-Triad-Enforcement | `97-cia-triad-enforcement.md` | Confidentiality, Integrity, Availability |
| RULE-98 | Visible-Security-Failures | `98-visible-security-failures.md` | Visible security failure indicators |

## Security Patterns Detected

### Critical Issues (🔴)

#### 1. Hardcoded Credentials (RULE-90)
- **Pattern**: `/(password|secret|api[_-]?key|token|pwd|passwd|auth|credential)[\s=:]+['"]\w+['"]/i`
- **CIA Impact**: Confidentiality
- **Recommendation**: Move secrets to environment variables or secure vault

#### 2. SQL Injection Risk (RULE-80)
- **Pattern**: `/(SELECT|INSERT|UPDATE|DELETE).*\+.*['"]\s*\+/i`
- **CIA Impact**: Integrity, Confidentiality
- **Recommendation**: Use parameterized queries or ORM with proper escaping

#### 3. XSS Vulnerability (RULE-80)
- **Pattern**: `/dangerouslySetInnerHTML|innerHTML\s*=|document\.write\(|eval\(/i`
- **CIA Impact**: Integrity, Confidentiality
- **Recommendation**: Sanitize all inputs and use safe rendering methods

#### 4. Missing Authentication (RULE-65)
- **Pattern**: `/<Route.*element=.*\/>/`
- **CIA Impact**: Confidentiality, Integrity, Availability
- **Recommendation**: Implement authentication using Auth0, Firebase Auth, or Passport.js

#### 5. Unsafe Code Execution (RULE-80)
- **Pattern**: `/eval\(|Function\(|setTimeout\(['"]/i`
- **CIA Impact**: Integrity, Availability
- **Recommendation**: Avoid eval() and Function constructor

### High Issues (🟠)

#### 6. Missing CSRF Protection (RULE-80)
- **Pattern**: `/<form[^>]*method=['"]post['"][^>]*>/i`
- **CIA Impact**: Integrity
- **Recommendation**: Implement CSRF tokens for all state-changing operations

#### 7. Missing Input Validation (RULE-80)
- **Pattern**: `/req\.(body|query|params)\.\w+(?!.*validate)/i`
- **CIA Impact**: Integrity
- **Recommendation**: Validate all user inputs using validation libraries

#### 8. Secret Exposure in Logs (RULE-90)
- **Pattern**: `/console\.(log|info|debug|warn)\(.*?(password|secret|token|key|credential)/i`
- **CIA Impact**: Confidentiality
- **Recommendation**: Never log sensitive data

#### 9. Missing Rate Limiting (RULE-97)
- **Pattern**: `/app\.(post|put|delete)\(['"]\/(api|auth)/i`
- **CIA Impact**: Availability
- **Recommendation**: Implement rate limiting using express-rate-limit

#### 10. Missing HTTPS Enforcement (RULE-97)
- **Pattern**: `/http:\/\//i`
- **CIA Impact**: Confidentiality, Integrity
- **Recommendation**: Use HTTPS for all communications

### Medium Issues (🟡)

#### 11. Insecure Randomness (RULE-80)
- **Pattern**: `/Math\.random\(\)/i`
- **CIA Impact**: Confidentiality
- **Recommendation**: Use crypto.randomBytes() or crypto.getRandomValues()

### Low Issues (🔵)

#### 12. Debug Statements (RULE-60)
- **Pattern**: `/console\.(log|warn|error|info|debug)\(/i`
- **CIA Impact**: Confidentiality
- **Recommendation**: Remove debug statements or use proper logging framework

## Report Structure

### Markdown Report
Each finding in `security-audit/security-report.md` includes:
- **Severity**: Visual indicator (🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low)
- **Rule ID**: Reference to the specific rule (e.g., RULE-65)
- **Rule Name**: Human-readable rule name
- **CIA Impact**: Which CIA Triad principles are affected
- **Location**: File path where the issue was found
- **Lines**: Specific line numbers
- **Description**: What the issue is
- **Recommendation**: How to fix it
- **Status**: Current status (🆕 New, 🔄 In Progress, ✅ Resolved)
- **Code Evidence**: Actual code snippets showing the issue

### HTML Report
The HTML report (`security-audit/security-report.html`) provides:
- Styled, responsive interface
- Color-coded severity levels
- Easy navigation
- Shareable with non-technical stakeholders
- Can be opened in any web browser

## Workflow Integration

### Automated Scanning
When vibe coding makes changes:
1. Code modifications are completed
2. Security scan runs automatically
3. Findings are cross-referenced with rules
4. Reports are updated with timestamps
5. Console shows summary of findings

### Manual Scanning
To run a security scan manually:
```bash
node security-scan.js
```

### Viewing Reports
- **Markdown**: `security-audit/security-report.md`
- **HTML**: `security-audit/security-report.html`

## CIA Triad Enforcement

The scanner enforces the CIA Triad principles:

### Confidentiality
- Hardcoded credentials detection
- Secret exposure in logs
- Missing HTTPS enforcement
- Insecure randomness
- Debug statements

### Integrity
- SQL injection detection
- XSS vulnerability detection
- Missing input validation
- Missing CSRF protection
- Unsafe code execution

### Availability
- Missing rate limiting
- Missing authentication (affects availability through unauthorized access)

## Compliance

### Standards Supported
- OWASP Top 10
- NIST Cybersecurity Framework
- CIS Benchmarks
- ISO 27001

### Regulatory Compliance
- GDPR (EU Data Protection)
- HIPAA (Healthcare Data)
- PCI DSS (Payment Data)
- SOC 2 (Service Organizations)

## Best Practices

### For Developers
1. Run security scan after each code change
2. Address critical issues immediately
3. Review all findings before committing
4. Update status in reports as issues are resolved
5. Document any exceptions or false positives

### For Security Teams
1. Review HTML reports regularly
2. Track trends in security findings
3. Update security rules based on new threats
4. Provide feedback on scan patterns
5. Conduct periodic security audits

### For Vibe Coding
1. Security scan runs automatically after code changes
2. All findings are logged to centralized reports
3. Rules are enforced during code generation
4. Visible security indicators are added to code
5. CIA Triad principles are maintained

## Extending the Scanner

### Adding New Patterns
To add a new security pattern:
1. Open `security-scan.js`
2. Add a new entry to the `securityPatterns` array
3. Include: name, pattern, severity, description, ruleId, ruleName, ciaImpact, recommendation
4. Test the pattern against sample code
5. Update this documentation

### Creating New Rules
To create a new security rule:
1. Create a new file in `.windsurf/rules/` (e.g., `85-new-rule.md`)
2. Document the rule requirements
3. Add corresponding patterns to `security-scan.js`
4. Update `01-rules-index.md`
5. Run a security scan to verify

## Troubleshooting

### No Issues Detected
- Verify the scanner is checking the correct directory
- Check that file extensions are included (.js, .jsx, .ts, .tsx)
- Review security patterns for accuracy

### False Positives
- Document exceptions in code comments
- Update patterns to be more specific
- Add exclusion logic if needed

### Missing Issues
- Review security patterns
- Add new patterns for uncovered cases
- Update rule definitions

## Support

For questions or issues:
1. Review this documentation
2. Check the security reports
3. Consult the security rules in `.windsurf/rules/`
4. Contact the security team

---

**Last Updated**: December 15, 2025
**Version**: 1.0.0
**Maintained By**: Security Team
