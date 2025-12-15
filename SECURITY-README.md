# Security Vulnerabilities in Demo Application

⚠️ **IMPORTANT**: This application contains intentional security vulnerabilities for demonstration and educational purposes only. Do not deploy this application to production environments.

## Purpose
This application serves as a learning tool to demonstrate common security vulnerabilities in web applications. The vulnerabilities are intentionally included to help developers understand security risks and learn how to mitigate them.

## Intentionally Included Vulnerabilities

### 1. Missing Authentication
- **Location**: All routes in `App.tsx`
- **Risk**: Unauthorized access to sensitive functionality
- **Intentional For**: Demonstrating the importance of authentication

### 2. No Input Validation
- **Location**: Form inputs throughout the application
- **Risk**: Potential XSS and injection attacks
- **Intentional For**: Showing the impact of unvalidated user input

### 3. Hardcoded Credentials
- **Location**: Various components
- **Risk**: Security breaches if code is exposed
- **Intentional For**: Demonstrating poor security practices

### 4. Lack of Rate Limiting
- **Location**: API endpoints
- **Risk**: Brute force and DDoS attacks
- **Intentional For**: Highlighting the need for request throttling

### 5. Insecure Dependencies
- **Location**: `package.json`
- **Risk**: Known vulnerabilities in dependencies
- **Intentional For**: Teaching dependency management

## How to Use This Demo
1. **For Educators**:
   - Use this application to demonstrate security vulnerabilities in a controlled environment
   - Walk through each vulnerability and its potential impact
   - Show how to identify and fix these issues

2. **For Learners**:
   - Study the code to identify security issues
   - Research each vulnerability type
   - Practice fixing the issues in a separate branch

## Security Audit System

This project includes an automated security audit system that helps track and manage security findings. The system generates both HTML and Markdown reports for easy review.

### Features
- **Automated Scanning**: Scans the codebase for common security issues
- **Centralized Reporting**: All findings are logged to a single report file
- **Multiple Formats**: Reports available in both HTML and Markdown
- **Historical Tracking**: Tracks findings over time with timestamps

### How to Use

#### Running a Security Scan
```bash
node security-scan.js
```

#### Viewing Reports
- **HTML Report**: Open `security-audit/security-report.html` in a web browser
- **Markdown Report**: View `security-audit/security-report.md` for the raw report

#### Report Contents
- Scan timestamps
- List of identified security issues
- Severity levels for each finding
- File locations and line numbers
- Status tracking (New, In Progress, Resolved)

## Security Best Practices (Not Implemented in This Demo)
- Implement proper authentication and authorization
- Validate and sanitize all user inputs
- Use environment variables for sensitive data
- Keep dependencies updated
- Implement rate limiting
- Use HTTPS in production
- Regular security audits

## Reporting Issues
If you find any security issues that are not part of the intended vulnerabilities, please report them to the maintainers.

## Disclaimer
This application is provided "as is" for educational purposes only. The maintainers are not responsible for any misuse or damage caused by this application.
