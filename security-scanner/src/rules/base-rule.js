class BaseRule {
  constructor(options = {}) {
    this.id = options.id || this.constructor.name;
    this.name = options.name || this.constructor.name;
    this.severity = options.severity || 'medium';
    this.description = options.description || '';
    this.recommendation = options.recommendation || '';
    this.pattern = options.pattern || null;
    this.metadata = {
      category: options.category || 'security',
      cwe: options.cwe || '',
      owasp: options.owasp || '',
      ...(options.metadata || {})
    };
  }

  // Override this method in child classes for custom detection logic
  detect(content, filePath) {
    if (!this.pattern) {
      return [];
    }

    const regex = new RegExp(this.pattern, 'g');
    const matches = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        line: this.getLineNumber(content, match.index),
        match: match[0],
        groups: match.groups || {},
        index: match.index
      });
    }

    return matches;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  getDescription(match) {
    return typeof this.description === 'function' 
      ? this.description(match) 
      : this.description;
  }

  getRecommendation(match) {
    return typeof this.recommendation === 'function'
      ? this.recommendation(match)
      : this.recommendation;
  }

  appliesTo(filePath) {
    if (!this.filePattern) return true;
    const regex = new RegExp(this.filePattern);
    return regex.test(filePath);
  }

  // Helper to create a rule from a simple object
  static create(ruleDef) {
    return new (class extends BaseRule {
      constructor() {
        super(ruleDef);
      }
    })();
  }
}

module.exports = { BaseRule };
