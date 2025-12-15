# Authentication Requirements

1. **Mandatory Authentication**:
   - All applications handling user data MUST implement authentication
   - Must include proper session management
   - Must include password policies
   - Must include account lockout mechanisms

2. **Authentication Standards**:
   - Use industry-standard authentication libraries (e.g., Auth0, Firebase Auth, or Passport.js)
   - Implement proper password hashing (bcrypt, Argon2, etc.)
   - Enforce secure password policies (min length, complexity requirements)
   - Implement secure session management with proper timeouts
   - Include CSRF protection
   - Use HTTPS for all authentication-related communications

3. **Authorization**:
   - Implement role-based access control (RBAC)
   - Follow principle of least privilege
   - Regular access reviews
   - Log all access to sensitive data

4. **Sensitive Data Protection**:
   - All sensitive routes must be protected
   - API endpoints must validate authentication tokens
   - Session timeouts must be implemented
   - Secure storage of tokens and credentials

5. **Implementation Requirements**:
   - Use secure, up-to-date libraries
   - Regular security audits of authentication flows
   - Rate limiting on authentication endpoints
   - Logging of authentication attempts (without logging sensitive data)
   - Secure password reset flows
   - Multi-factor authentication for sensitive operations

6. **Testing Requirements**:
   - Unit tests for all authentication flows
   - Penetration testing of authentication endpoints
   - Regular security scanning for vulnerabilities
   - Automated testing for common security issues (OWASP Top 10)

7. **Documentation**:
   - Document authentication flows
   - Document security assumptions and guarantees
   - Document recovery procedures
   - Document incident response plan for security breaches

8. **Compliance**:
   - Follow OWASP Authentication Cheat Sheet
   - Comply with relevant regulations (GDPR, HIPAA, etc.)
   - Regular security training for developers
   - Regular security audits and updates
