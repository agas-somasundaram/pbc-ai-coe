# Rules Index

The model must load ALL rules in this directory before performing any task.
This index ensures that architecture, workflow, testing, and all security rules
are always considered during reasoning and generation.

## Core Rules
- **00-project_overview.md**: Project overview and scope
- **01-rules-index.md**: This file - index of all rules

## Architecture & Structure
- **10-architecture.md**: System architecture guidelines
- **20-frontend.md**: Frontend development standards
- **30-backend.md**: Backend development standards

## Development Process
- **40-testing-quality.md**: Testing and quality assurance
- **50-workflow-constraints.md**: Development workflow constraints

## Security Rules (60-99)
- **60-security-baseline.md**: Core security requirements
- **65-authentication-requirements.md**: Authentication and authorization standards
- **70-dependency-and-CVE-checks.md**: Dependency security
- **80-secure-code-patterns.md**: Secure coding practices
- **90-infra-secrets-policy.md**: Secrets and infrastructure security
- **95-security-super-rule.md**: Master security rule binding all security rules
- **96-pr-reviewer-mode.md**: Code review security checks
- **97-cia-triad-enforcement.md**: Global security enforcement of CIA principles

## Rule Loading Order
Rules are loaded in numerical order (00-99), with higher numbers taking precedence. Security rules (60-99) are considered critical and will be strictly enforced.
