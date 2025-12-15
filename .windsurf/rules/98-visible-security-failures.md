# 98. Visible Security Failures (Global Rule)

## 🚨 SECURITY ALERT: VISIBLE FAILURE INDICATORS REQUIRED 🚨

### 1. Failure Indicators

#### 1.1 Visual Indicators
```
🚨 SECURITY FAILURE: [ISSUE_DESCRIPTION]
   → Severity: [CRITICAL/HIGH/MEDIUM/LOW]
   → Impact: [IMPACT_DESCRIPTION]
   → Location: [FILE:LINE]
   → Fix: [REQUIRED_ACTION]
```

#### 1.2 Required Indicators
1. **Authentication Issues**
   ```
   🔴 AUTH FAILURE: Missing authentication
      → Severity: CRITICAL
      → Impact: Unauthorized access possible
      → Location: App.tsx
      → Fix: Implement JWT/OAuth authentication
   ```

2. **Data Validation**
   ```
   🔴 VALIDATION FAILURE: Unsanitized input
      → Severity: HIGH
      → Impact: Potential XSS/SQL Injection
      → Location: FormComponent.jsx:42
      → Fix: Add input validation/sanitization
   ```

3. **Dependency Vulnerabilities**
   ```
   🔴 VULNERABILITY: Outdated dependency
      → Severity: CRITICAL
      → Impact: Known security vulnerabilities
      → Package: package-name@version
      → Fix: Update to version X.Y.Z
   ```

### 2. Implementation Rules

1. **Visual Indicators**
   - Use 🔴 for critical issues
   - Use 🟠 for high severity
   - Use 🟡 for medium severity
   - Use ⚪ for low severity

2. **Required Information**
   - Clear description
   - Severity level
   - Impact assessment
   - Exact location
   - Recommended fix

3. **Placement**
   - Above the affected code
   - In pull request comments
   - In CI/CD pipeline output
   - In development console

### 3. Example Implementation

#### 3.1 Inline Comments
```typescript
// 🔴 SECURITY FAILURE: Missing authentication
//    → Severity: CRITICAL
//    → Impact: Any user can access all data
//    → Location: api/routes/userData.ts
//    → Fix: Add JWT validation middleware
app.get('/api/user-data', (req, res) => {
  // ... sensitive data access
});
```

#### 3.2 Component-Level
```typescript
/**
 * 🚨 SECURITY ALERT: Missing Input Sanitization
 * → Severity: HIGH
 * → Impact: XSS Vulnerability
 * → Location: components/UserProfile.jsx
 * → Fix: Use react-html-parser with sanitization
 */
function UserProfile({ userInput }) {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
}
```

### 4. Enforcement

1. **Pre-commit Hooks**
   - Block commits with security issues
   - Require acknowledgment of warnings

2. **CI/CD Pipeline**
   - Fail builds on critical issues
   - Generate security reports
   - Post notifications

3. **Code Reviews**
   - Required for security changes
   - Multiple approvers for critical fixes
   - Security team sign-off

### 5. Severity Levels

| Level     | Icon | Description                          |
|-----------|------|--------------------------------------|
| Critical | 🔴   | Immediate fix required               |
| High     | 🟠   | Fix in next release                  |
| Medium   | 🟡   | Address in planned update            |
| Low      | ⚪   | Consider in future improvements      |

### 6. Required Actions

1. **Immediate (🔴)**
   - Stop deployment
   - Hotfix required
   - Security team notification

2. **High (🟠)**
   - Fix before next release
   - Document workaround
   - Security review required

3. **Medium (🟡)**
   - Schedule fix
   - Risk assessment
   - Monitor for exploitation

4. **Low (⚪)**
   - Document issue
   - Consider in planning
   - Low priority fix

---
**NOTE**: These indicators must be clearly visible and should not be ignored. Any attempt to suppress or remove these indicators without addressing the underlying issues is a violation of security policies.
