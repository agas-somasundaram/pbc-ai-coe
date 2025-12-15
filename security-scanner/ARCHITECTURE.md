# Security Scanner Framework - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│  CLI Tool          │  Programmatic API  │  CI/CD Integration   │
│  (bin/scan)        │  (src/index.js)    │  (GitHub, GitLab)    │
└──────────────┬──────────────┬──────────────────┬────────────────┘
               │              │                  │
               └──────────────┴──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Configuration   │
                    │  (.securityrc)    │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Security Scanner │
                    │   (core/scanner)  │
                    └─────────┬─────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
       ┌────────▼────────┐   │   ┌────────▼────────┐
       │  Rules Loader   │   │   │     Logger      │
       │ (rules-loader)  │   │   │  (utils/logger) │
       └────────┬────────┘   │   └─────────────────┘
                │             │
       ┌────────▼────────┐   │
       │   Rule Engine   │   │
       │  ┌───────────┐  │   │
       │  │ Built-in  │  │   │
       │  │  Rules    │  │   │
       │  └───────────┘  │   │
       │  ┌───────────┐  │   │
       │  │  Custom   │  │   │
       │  │  Rules    │  │   │
       │  └───────────┘  │   │
       └────────┬────────┘   │
                │             │
                └─────────────┘
                      │
            ┌─────────▼─────────┐
            │   Scan Results    │
            │   (findings +     │
            │    metadata)      │
            └─────────┬─────────┘
                      │
            ┌─────────▼─────────┐
            │     Reporter      │
            │  (core/reporter)  │
            └─────────┬─────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Markdown │  │  HTML   │  │  JSON   │
   │ Report  │  │ Report  │  │ Report  │
   └─────────┘  └─────────┘  └─────────┘
```

## Component Breakdown

### 1. User Interface Layer

#### CLI Tool (`bin/scan`)
```javascript
security-scan [options]
  --root <path>         # Root directory
  --rules-dir <path>    # Custom rules
  --format <format>     # Output format
  --exit-code           # Exit with error code
```

#### Programmatic API (`src/index.js`)
```javascript
const { scan, createScanner } = require('@your-org/security-scanner');

// Simple usage
await scan({ rootDir: './src' });

// Advanced usage
const scanner = await createScanner(options);
const results = await scanner.scan();
```

#### CI/CD Integration
- GitHub Actions workflows
- GitLab CI pipelines
- Jenkins pipelines
- Pre-commit hooks

### 2. Configuration Layer

#### Configuration File (`.securityrc.json`)
```json
{
  "rulesDir": ".security/rules",
  "include": ["src/**/*.{js,ts}"],
  "exclude": ["**/node_modules/**"],
  "reporter": {
    "outputDir": "./security-audit",
    "formats": ["html", "markdown", "json"]
  }
}
```

#### Environment Variables
```bash
LOG_LEVEL=debug
SECURITY_RULES_DIR=./custom-rules
```

### 3. Core Scanning Engine

#### SecurityScanner Class
```javascript
class SecurityScanner {
  constructor(config)     // Initialize with config
  async init()            // Load rules
  async scan()            // Execute scan
  async findFiles()       // Find files to scan
  async scanFile(file)    // Scan individual file
  addFindings()           // Collect findings
  getResults()            // Return results
  getSummary()            // Generate summary
}
```

**Responsibilities:**
- File discovery and filtering
- Rule execution orchestration
- Finding collection and aggregation
- Result formatting

### 4. Rules System

#### BaseRule Class
```javascript
class BaseRule {
  constructor(options)              // Rule definition
  detect(content, filePath)         // Detection logic
  appliesTo(filePath)               // File filtering
  getDescription(match)             // Dynamic description
  getRecommendation(match)          // Dynamic recommendation
  getLineNumber(content, index)     // Helper method
}
```

#### Rules Loader
```javascript
async function loadRules(rulesDir) {
  // 1. Load built-in rules
  // 2. Load custom rules from rulesDir
  // 3. Instantiate rule classes
  // 4. Return array of rule instances
}
```

#### Rule Types

**Built-in Rules** (`src/rules/rules/default-rules.js`)
- 12 pre-configured security rules
- Based on OWASP Top 10, CWE
- Ready to use out of the box

**Custom Rules** (User-defined)
- Extend BaseRule class
- Project-specific patterns
- Organization standards

### 5. Reporter System

#### Reporter Class
```javascript
class Reporter {
  constructor(config)                    // Reporter config
  async generateReports(results)         // Generate all formats
  async generateMarkdown(results)        // MD report
  async generateHtml(results)            // HTML report
  async generateJson(results)            // JSON report
  getSeverityEmoji(severity)             // Visual indicators
  escapeHtml(text)                       // HTML escaping
}
```

**Report Formats:**

1. **Markdown** - Technical documentation
2. **HTML** - Stakeholder-friendly, visual
3. **JSON** - Machine-readable, CI/CD

### 6. Utility Layer

#### Logger
```javascript
class Logger {
  error(...)    // Error messages
  warn(...)     // Warnings
  info(...)     // Information
  debug(...)    // Debug output
  log(level, ...)  // Generic logging
}
```

## Data Flow

### 1. Initialization Flow
```
User runs scan
    ↓
Load configuration (.securityrc.json)
    ↓
Initialize SecurityScanner
    ↓
Load rules (built-in + custom)
    ↓
Validate configuration
    ↓
Ready to scan
```

### 2. Scanning Flow
```
Find files (glob patterns)
    ↓
For each file:
    ↓
    Read file content
    ↓
    For each rule:
        ↓
        Check if rule applies to file
        ↓
        Run detection logic
        ↓
        Collect findings
    ↓
Aggregate all findings
    ↓
Generate summary
    ↓
Return results
```

### 3. Reporting Flow
```
Receive scan results
    ↓
For each format (MD, HTML, JSON):
    ↓
    Format findings
    ↓
    Apply styling/structure
    ↓
    Write to file
    ↓
Return report paths
```

## Rule Execution Model

### Pattern Matching
```javascript
// 1. Compile regex pattern
const regex = new RegExp(pattern, 'g');

// 2. Find all matches
while ((match = regex.exec(content)) !== null) {
  // 3. Get line number
  const line = getLineNumber(content, match.index);
  
  // 4. Create finding
  findings.push({ line, match, ... });
}
```

### Custom Detection
```javascript
class CustomRule extends BaseRule {
  detect(content, filePath) {
    // Custom logic
    if (complexCondition(content)) {
      return [{ line: X, match: 'pattern' }];
    }
    return [];
  }
}
```

## Extensibility Points

### 1. Custom Rules
```javascript
// Extend BaseRule
class MyRule extends BaseRule {
  constructor() { super({ ... }); }
  detect(content, filePath) { ... }
  appliesTo(filePath) { ... }
}
```

### 2. Custom Reporters
```javascript
// Extend Reporter
class MyReporter extends Reporter {
  async generateCustomFormat(results) {
    // Custom report generation
  }
}
```

### 3. Custom File Filters
```javascript
// In configuration
{
  "include": ["custom/**/*.pattern"],
  "exclude": ["custom/**/ignore/**"]
}
```

### 4. Rule Configuration
```json
{
  "rules": {
    "RULE-90": {
      "enabled": true,
      "severity": "critical",
      "customOption": "value"
    }
  }
}
```

## Performance Considerations

### File Processing
- **Parallel Processing**: Rules run in parallel per file
- **Lazy Loading**: Files loaded on-demand
- **Caching**: Compiled regex patterns cached
- **Streaming**: Large files processed in chunks

### Memory Management
- **Bounded Memory**: Process files in batches
- **Garbage Collection**: Clear processed data
- **Resource Limits**: Configurable limits

### Optimization Strategies
1. **Early Exit**: Skip files that don't match patterns
2. **Rule Filtering**: Only apply relevant rules per file
3. **Incremental Scanning**: Only scan changed files
4. **Result Caching**: Cache previous scan results

## Security Considerations

### Input Validation
- Validate all configuration inputs
- Sanitize file paths
- Escape output in reports

### Sandboxing
- Rules run in isolated context
- No file system access from rules
- Limited regex complexity

### Error Handling
- Graceful degradation
- Detailed error messages
- No sensitive data in logs

## Testing Strategy

### Unit Tests
```javascript
describe('SecurityScanner', () => {
  test('should detect hardcoded secrets', () => {
    const content = 'password = "secret123"';
    const findings = rule.detect(content);
    expect(findings).toHaveLength(1);
  });
});
```

### Integration Tests
```javascript
describe('Full Scan', () => {
  test('should scan project and generate reports', async () => {
    const results = await scan({ rootDir: './test-project' });
    expect(results.findings.length).toBeGreaterThan(0);
  });
});
```

### End-to-End Tests
```javascript
describe('CLI', () => {
  test('should run scan via CLI', () => {
    const output = execSync('security-scan --root ./test-project');
    expect(output).toContain('Security scan completed');
  });
});
```

## Deployment Models

### 1. NPM Package
```bash
npm install @your-org/security-scanner
```

### 2. Docker Container
```dockerfile
FROM node:18
RUN npm install -g @your-org/security-scanner
CMD ["security-scan"]
```

### 3. GitHub Action
```yaml
- uses: your-org/security-scanner-action@v1
  with:
    root-dir: ./src
```

### 4. Standalone Binary
```bash
# Using pkg or nexe
pkg security-scanner
```

## Monitoring and Observability

### Metrics
- Scan duration
- Files processed
- Rules executed
- Findings by severity
- False positive rate

### Logging
- Structured logging (JSON)
- Log levels (error, warn, info, debug)
- Correlation IDs
- Performance traces

### Alerting
- Critical findings detected
- Scan failures
- Performance degradation
- Configuration errors

---

## Architecture Principles

1. **Separation of Concerns**: Each component has single responsibility
2. **Dependency Injection**: Components receive dependencies
3. **Open/Closed**: Open for extension, closed for modification
4. **Interface Segregation**: Small, focused interfaces
5. **Dependency Inversion**: Depend on abstractions, not concretions

**This architecture ensures the framework is maintainable, testable, and extensible!** 🏗️
