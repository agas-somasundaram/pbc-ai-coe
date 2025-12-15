const fs = require('fs');
const path = require('path');

class AuditLogger {
  constructor() {
    this.auditDir = __dirname;
    this.reportFile = path.join(this.auditDir, 'security-report.md');
    this.htmlReportFile = path.join(this.auditDir, 'security-report.html');
    this.ensureAuditDir();
    this.ensureReportFiles();
  }

  ensureAuditDir() {
    if (!fs.existsSync(this.auditDir)) {
      fs.mkdirSync(this.auditDir, { recursive: true });
    }
  }

  ensureReportFiles() {
    const timestamp = new Date().toISOString();
    const initialContent = `# Security Audit Report

> Generated: ${timestamp}

## Scan History

`;

    if (!fs.existsSync(this.reportFile)) {
      fs.writeFileSync(this.reportFile, initialContent, 'utf8');
    }

    if (!fs.existsSync(this.htmlReportFile)) {
      this.generateHtmlReport(initialContent);
    }
  }

  getCurrentTimestamp() {
    return new Date().toLocaleString();
  }

  generateHtmlReport(markdownContent) {
    // Simple markdown to HTML conversion
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Security Audit Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .finding { margin-bottom: 20px; padding: 15px; border-left: 4px solid #dc3545; background: #f8f9fa; }
    .finding.resolved { border-color: #28a745; opacity: 0.7; }
    .timestamp { color: #6c757d; font-size: 0.9em; }
    .severity { font-weight: bold; padding: 2px 6px; border-radius: 3px; }
    .critical { color: #721c24; background: #f8d7da; }
    .high { color: #856404; background: #fff3cd; }
    .medium { color: #004085; background: #cce5ff; }
    .low { color: #155724; background: #d4edda; }
    pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Security Audit Report</h1>
  <p class="timestamp">Last updated: ${this.getCurrentTimestamp()}</p>
  <div id="content">
    ${this.markdownToHtml(markdownContent)}
  </div>
</body>
</html>`;
    
    fs.writeFileSync(this.htmlReportFile, html, 'utf8');
  }

  markdownToHtml(markdown) {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\s*\n/g, '</p><p>')
      .replace(/^\s*\- (.*$)/gm, '<li>$1</li>')
      .replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`);
  }

  logSecurityScanResults(scanResults) {
    const timestamp = this.getCurrentTimestamp();
    let reportContent = `\n## Scan - ${timestamp}\n\n`;

    if (scanResults.length === 0) {
      reportContent += '✅ No new security issues found.\n\n';
    } else {
      reportContent += `Found ${scanResults.length} potential security issues:\n\n`;
      
      scanResults.forEach((finding, index) => {
        reportContent += `### ${index + 1}. ${finding.issue}\n`;
        reportContent += `- **Severity**: ${finding.severity}\n`;
        reportContent += `- **Rule ID**: ${finding.ruleId || 'N/A'}\n`;
        reportContent += `- **Rule Name**: ${finding.ruleName || 'N/A'}\n`;
        reportContent += `- **CIA Impact**: ${finding.ciaImpact || 'N/A'}\n`;
        reportContent += `- **Location**: ${finding.file}\n`;
        if (finding.lines && finding.lines.length > 0) {
          reportContent += `- **Lines**: ${finding.lines.map(l => l.line).join(', ')}\n`;
        }
        reportContent += `- **Description**: ${finding.description}\n`;
        reportContent += `- **Recommendation**: ${finding.recommendation || 'Review and fix the identified issue.'}\n`;
        reportContent += `- **Status**: 🆕 New\n\n`;
        
        if (finding.lines && finding.lines.length > 0) {
          reportContent += '**Code Evidence:**\n```\n';
          finding.lines.slice(0, 3).forEach(line => {
            reportContent += `Line ${line.line}: ${line.content}\n`;
          });
          if (finding.lines.length > 3) {
            reportContent += `... and ${finding.lines.length - 3} more lines\n`;
          }
          reportContent += '```\n\n';
        }
      });
    }

    // Append to the markdown report
    fs.appendFileSync(this.reportFile, reportContent, 'utf8');
    
    // Update HTML report
    const fullMarkdown = fs.readFileSync(this.reportFile, 'utf8');
    this.generateHtmlReport(fullMarkdown);

    return {
      markdownReport: this.reportFile,
      htmlReport: this.htmlReportFile,
      timestamp,
      findingsCount: scanResults.length
    };
  }
}

module.exports = AuditLogger;
