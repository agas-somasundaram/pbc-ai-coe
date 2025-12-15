const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { loadRules } = require('../rules/rules-loader');
const { Logger } = require('../utils/logger');

class SecurityScanner {
  constructor(config = {}) {
    this.config = {
      rootDir: process.cwd(),
      rulesDir: path.join(process.cwd(), '.windsurf/rules'),
      include: ['**/*.{js,jsx,ts,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
      ...config
    };
    
    this.logger = new Logger(this.config);
    this.rules = [];
    this.findings = [];
  }

  async init() {
    this.rules = await loadRules(this.config.rulesDir);
    this.logger.info(`Loaded ${this.rules.length} security rules`);
    return this;
  }

  async scan() {
    const files = await this.findFiles();
    this.logger.info(`Scanning ${files.length} files...`);

    for (const file of files) {
      await this.scanFile(file);
    }

    return this.getResults();
  }

  async findFiles() {
    const { include, exclude } = this.config;
    const options = {
      cwd: this.config.rootDir,
      ignore: exclude,
      absolute: true,
      nodir: true
    };

    const fileGroups = await Promise.all(
      include.map(pattern => glob(pattern, options))
    );
    
    return fileGroups.flat();
  }

  async scanFile(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const lines = content.split('\n');

      for (const rule of this.rules) {
        if (rule.appliesTo && !rule.appliesTo(filePath)) {
          continue;
        }

        const matches = rule.detect(content, filePath);
        if (matches && matches.length > 0) {
          this.addFindings(matches, filePath, lines, rule);
        }
      }
    } catch (error) {
      this.logger.error(`Error scanning file ${filePath}:`, error);
    }
  }

  addFindings(matches, filePath, lines, rule) {
    const relativePath = path.relative(this.config.rootDir, filePath);
    
    matches.forEach(match => {
      const finding = {
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        description: rule.getDescription(match),
        recommendation: rule.getRecommendation(match),
        file: relativePath,
        lines: [],
        metadata: {
          ...rule.metadata,
          ...(match.metadata || {})
        }
      };

      // Add line context
      if (match.line) {
        const lineNum = match.line - 1; // Convert to 0-based index
        const startLine = Math.max(0, lineNum - 2);
        const endLine = Math.min(lines.length - 1, lineNum + 2);
        
        for (let i = startLine; i <= endLine; i++) {
          finding.lines.push({
            line: i + 1, // Convert back to 1-based line numbers
            content: lines[i],
            isMatch: i === lineNum
          });
        }
      }

      this.findings.push(finding);
    });
  }

  getResults() {
    return {
      findings: this.findings,
      summary: this.getSummary(),
      scannedAt: new Date().toISOString(),
      config: {
        rootDir: this.config.rootDir,
        rulesLoaded: this.rules.length
      }
    };
  }

  getSummary() {
    const summary = {
      total: this.findings.length,
      bySeverity: {},
      byRule: {}
    };

    this.findings.forEach(finding => {
      // Count by severity
      summary.bySeverity[finding.severity] = 
        (summary.bySeverity[finding.severity] || 0) + 1;
      
      // Count by rule
      const ruleKey = `${finding.ruleId} - ${finding.ruleName}`;
      summary.byRule[ruleKey] = (summary.byRule[ruleKey] || 0) + 1;
    });

    return summary;
  }
}

module.exports = { SecurityScanner };
