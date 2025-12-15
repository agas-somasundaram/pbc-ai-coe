# Global Security Rules (Always Active)

1. Always treat security as a first-class requirement.
2. Whenever you modify or create code, perform a quick inline security review:
   - Look for common vulnerabilities in the relevant language/framework.
   - Flag weak patterns and propose safer alternatives.
3. When editing or adding dependencies:
   - Check for known CVEs associated with the dependency name and version.
   - If any risk exists, warn me immediately and suggest a safe alternative.
4. Never introduce code that:
   - Hardcodes secrets or API keys.
   - Weakens authentication or authorization checks.
   - Bypasses validation, sanitization, or escaping.
5. If any uncertainty arises regarding security, explicitly state it and propose a safe default.
6. When making suggestions or changes, briefly annotate any security-related decisions.
7. Never remove logging, input validation, or sanitization unless explicitly instructed.
8. When refactoring, preserve or strengthen existing security boundaries and invariants.
