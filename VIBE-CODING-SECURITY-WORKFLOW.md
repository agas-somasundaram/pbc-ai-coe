# Vibe Coding Security Workflow

## Overview
This document describes how security scanning is integrated into the vibe coding workflow to ensure all code changes are automatically audited for security issues.

## Workflow

### 1. Code Modification Phase
When vibe coding makes changes to the codebase:
- Code is modified according to user requirements
- Changes follow the security rules defined in `.windsurf/rules/`

### 2. Automatic Security Scanning
After code modifications are complete:
- The AI assistant automatically runs `node security-scan.js`
- Security patterns are checked against the modified code
- Findings are logged to the security audit system

### 3. Report Generation
The security scan generates:
- **Markdown Report**: `security-audit/security-report.md`
- **HTML Report**: `security-audit/security-report.html`
- Both reports are updated with timestamped findings

### 4. Review and Action
Based on scan results:
- **No Issues**: Proceed with confidence
- **Issues Found**: Review the security report and address findings

## Security Rules Integration

### Active Security Rules
The following rules are enforced during vibe coding:

1. **95-security-super-rule.md**: Master security rule binding all security checks
2. **97-cia-triad-enforcement.md**: CIA principles enforcement
3. **98-visible-security-failures.md**: Visible security failure indicators
4. **65-authentication-requirements.md**: Authentication standards
5. **80-secure-code-patterns.md**: Secure coding practices

### How Rules Trigger Scanning
- Rules are loaded before any code modification
- After modifications, the AI assistant runs the security scan
- Findings are cross-referenced with the active rules
- Reports include rule violations and recommendations

## Security Scan Patterns

The security scanner checks for:

### Critical Issues (🔴 High)
- Hardcoded credentials
- SQL injection vulnerabilities
- Missing authentication
- Insecure direct object references

### Medium Issues (🟠 Medium)
- XSS vulnerabilities
- Missing input validation
- Insecure dependencies

### Low Issues (🔵 Low)
- Debug statements in production
- Console logs
- Commented-out code

## Automated Actions

### What Happens Automatically
1. ✅ Security scan runs after code changes
2. ✅ Reports are generated and updated
3. ✅ Findings are logged with timestamps
4. ✅ Console output shows summary

### What Requires Manual Action
1. ⚠️ Reviewing the security report
2. ⚠️ Addressing identified issues
3. ⚠️ Updating status in reports
4. ⚠️ Re-running scan after fixes

## Report Structure

### Markdown Report (`security-report.md`)
```markdown
# Security Audit Report

> Generated: [timestamp]

## Scan History

## Scan - [timestamp]

Found X potential security issues:

### 1. [Issue Name]
- **Severity**: [Level]
- **Location**: [File path]
- **Lines**: [Line numbers]
- **Description**: [Details]
- **Status**: 🆕 New
```

### HTML Report (`security-report.html`)
- Styled, responsive HTML version
- Color-coded severity levels
- Easy to share with non-technical stakeholders
- Can be opened in any web browser

## Best Practices

### For Developers
1. Review security reports after each vibe coding session
2. Address critical issues immediately
3. Update status in reports as issues are resolved
4. Run manual scans when making security-sensitive changes

### For Security Teams
1. Review HTML reports regularly
2. Track trends in security findings
3. Update security rules based on findings
4. Provide feedback on scan patterns

## Integration with Git

### Recommended Git Workflow
1. Make changes with vibe coding
2. Security scan runs automatically
3. Review security report
4. Address critical issues before committing
5. Commit with reference to security scan

### Example Commit Message
```
feat: Add user authentication

Security scan: No new critical issues
Report: security-audit/security-report.html
```

## Troubleshooting

### Scan Not Running
- Ensure `security-scan.js` exists in project root
- Check that `security-audit/audit-logger.js` is present
- Verify Node.js is installed

### Reports Not Generated
- Check file permissions in `security-audit/` directory
- Ensure directory structure exists
- Review console output for errors

### False Positives
- Update security patterns in `security-scan.js`
- Add exceptions for known safe patterns
- Document exceptions in security report

## Future Enhancements

### Planned Features
- [ ] Status tracking UI
- [ ] Integration with CI/CD pipelines
- [ ] Custom rule definitions
- [ ] Automated fix suggestions
- [ ] Integration with vulnerability databases

## Support

For questions or issues with the security workflow:
1. Review this documentation
2. Check the security reports
3. Consult the security rules in `.windsurf/rules/`
4. Contact the security team

---

**Last Updated**: December 15, 2025
**Version**: 1.0.0
