const fs = require('fs');
const path = require('path');

class Reporter {
  constructor(config = {}) {
    this.config = {
      outputDir: config.outputDir || './security-audit',
      formats: config.formats || ['markdown', 'html'],
      ...config
    };
    
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  async generateReports(results) {
    const reports = {};
    
    if (this.config.formats.includes('markdown')) {
      reports.markdown = await this.generateMarkdown(results);
    }
    
    if (this.config.formats.includes('html')) {
      reports.html = await this.generateHtml(results);
    }
    
    if (this.config.formats.includes('json')) {
      reports.json = await this.generateJson(results);
    }
    
    return reports;
  }

  async generateMarkdown(results) {
    const timestamp = new Date().toLocaleString();
    const reportPath = path.join(this.config.outputDir, 'security-report.md');
    
    let content = this.readExistingReport(reportPath, '# Security Audit Report\n\n');
    
    content += `\n## Scan - ${timestamp}\n\n`;
    
    if (results.findings.length === 0) {
      content += '✅ No security issues found.\n\n';
    } else {
      content += `Found ${results.findings.length} potential security issues:\n\n`;
      
      results.findings.forEach((finding, index) => {
        content += `### ${index + 1}. ${finding.ruleName}\n`;
        content += `- **Severity**: ${this.getSeverityEmoji(finding.severity)} ${finding.severity}\n`;
        content += `- **Rule ID**: ${finding.ruleId}\n`;
        
        if (finding.metadata) {
          if (finding.metadata.ciaImpact) {
            content += `- **CIA Impact**: ${finding.metadata.ciaImpact}\n`;
          }
          if (finding.metadata.owasp) {
            content += `- **OWASP**: ${finding.metadata.owasp}\n`;
          }
          if (finding.metadata.cwe) {
            content += `- **CWE**: ${finding.metadata.cwe}\n`;
          }
        }
        
        content += `- **Location**: ${finding.file}\n`;
        
        if (finding.lines && finding.lines.length > 0) {
          const matchedLines = finding.lines.filter(l => l.isMatch).map(l => l.line);
          content += `- **Lines**: ${matchedLines.join(', ')}\n`;
        }
        
        content += `- **Description**: ${finding.description}\n`;
        content += `- **Recommendation**: ${finding.recommendation}\n`;
        content += `- **Status**: 🆕 New\n\n`;
        
        if (finding.lines && finding.lines.length > 0) {
          content += '**Code Evidence:**\n```\n';
          finding.lines.forEach(line => {
            const marker = line.isMatch ? '→ ' : '  ';
            content += `${marker}Line ${line.line}: ${line.content}\n`;
          });
          content += '```\n\n';
        }
      });
    }
    
    fs.writeFileSync(reportPath, content);
    return reportPath;
  }

  async generateHtml(results) {
    const timestamp = new Date().toLocaleString();
    const reportPath = path.join(this.config.outputDir, 'security-report.html');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Audit Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
           background: #f5f5f5; padding: 20px; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; background: white; 
                 border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { font-size: 2em; margin-bottom: 10px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
               gap: 20px; padding: 30px; background: #f9fafb; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; 
                 box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card h3 { color: #666; font-size: 0.9em; margin-bottom: 10px; }
    .stat-card .number { font-size: 2.5em; font-weight: bold; }
    .critical { color: #dc2626; }
    .high { color: #ea580c; }
    .medium { color: #ca8a04; }
    .low { color: #2563eb; }
    .findings { padding: 30px; }
    .finding { background: #f9fafb; border-left: 4px solid #ddd; 
               padding: 20px; margin-bottom: 20px; border-radius: 4px; }
    .finding.critical { border-left-color: #dc2626; }
    .finding.high { border-left-color: #ea580c; }
    .finding.medium { border-left-color: #ca8a04; }
    .finding.low { border-left-color: #2563eb; }
    .finding h3 { margin-bottom: 15px; color: #1f2937; }
    .finding-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px; }
    .meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.9em; }
    .meta-label { font-weight: 600; color: #6b7280; }
    .code-block { background: #1f2937; color: #e5e7eb; padding: 15px; 
                  border-radius: 4px; overflow-x: auto; margin-top: 15px; }
    .code-block pre { margin: 0; font-family: 'Monaco', 'Courier New', monospace; 
                      font-size: 0.85em; }
    .highlight { background: #374151; }
    .recommendation { background: #dbeafe; border-left: 3px solid #3b82f6; 
                      padding: 15px; margin-top: 15px; border-radius: 4px; }
    .no-issues { text-align: center; padding: 60px 20px; color: #059669; }
    .no-issues svg { width: 80px; height: 80px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Security Audit Report</h1>
      <p>Generated: ${timestamp}</p>
      <p>Scanned: ${results.config.rootDir}</p>
    </div>
    
    <div class="summary">
      <div class="stat-card">
        <h3>Total Issues</h3>
        <div class="number">${results.summary.total}</div>
      </div>
      ${Object.entries(results.summary.bySeverity).map(([severity, count]) => `
      <div class="stat-card">
        <h3>${severity.charAt(0).toUpperCase() + severity.slice(1)}</h3>
        <div class="number ${severity}">${count}</div>
      </div>
      `).join('')}
    </div>
    
    <div class="findings">
      ${results.findings.length === 0 ? `
      <div class="no-issues">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2>No Security Issues Found!</h2>
        <p>Your codebase passed all security checks.</p>
      </div>
      ` : results.findings.map((finding, index) => `
      <div class="finding ${finding.severity}">
        <h3>${index + 1}. ${finding.ruleName}</h3>
        <div class="finding-meta">
          <div class="meta-item">
            <span class="meta-label">Severity:</span>
            <span class="${finding.severity}">${this.getSeverityEmoji(finding.severity)} ${finding.severity.toUpperCase()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Rule:</span>
            <span>${finding.ruleId}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">File:</span>
            <span>${finding.file}</span>
          </div>
          ${finding.metadata && finding.metadata.ciaImpact ? `
          <div class="meta-item">
            <span class="meta-label">CIA Impact:</span>
            <span>${finding.metadata.ciaImpact}</span>
          </div>
          ` : ''}
        </div>
        <p><strong>Description:</strong> ${finding.description}</p>
        ${finding.lines && finding.lines.length > 0 ? `
        <div class="code-block">
          <pre>${finding.lines.map(line => 
            `<div ${line.isMatch ? 'class="highlight"' : ''}>Line ${line.line}: ${this.escapeHtml(line.content)}</div>`
          ).join('')}</pre>
        </div>
        ` : ''}
        <div class="recommendation">
          <strong>💡 Recommendation:</strong> ${finding.recommendation}
        </div>
      </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(reportPath, html);
    return reportPath;
  }

  async generateJson(results) {
    const reportPath = path.join(this.config.outputDir, 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    return reportPath;
  }

  readExistingReport(reportPath, defaultContent) {
    if (fs.existsSync(reportPath)) {
      return fs.readFileSync(reportPath, 'utf8');
    }
    return defaultContent;
  }

  getSeverityEmoji(severity) {
    const emojis = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
      info: 'ℹ️'
    };
    return emojis[severity.toLowerCase()] || '⚪';
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

module.exports = { Reporter };
