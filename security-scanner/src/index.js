const { SecurityScanner } = require('./core/scanner');
const { Reporter } = require('./core/reporter');
const { Logger } = require('./utils/logger');
const path = require('path');

/**
 * Main entry point for the security scanner
 * @param {Object} options - Configuration options
 * @param {string} [options.rootDir=process.cwd()] - Root directory to scan
 * @param {string} [options.rulesDir] - Directory containing custom rules
 * @param {string[]} [options.include] - File patterns to include
 * @param {string[]} [options.exclude] - File patterns to exclude
 * @param {Object} [options.logger] - Logger configuration
 * @param {Object} [options.reporter] - Reporter configuration
 * @returns {Promise<Object>} Scan results with report paths
 */
async function scan(options = {}) {
  const scanner = new SecurityScanner({
    rootDir: options.rootDir || process.cwd(),
    rulesDir: options.rulesDir,
    include: options.include,
    exclude: options.exclude,
    logger: options.logger
  });

  await scanner.init();
  const results = await scanner.scan();
  
  // Generate reports if reporter options provided
  if (options.reporter !== false) {
    const reporter = new Reporter(options.reporter || {});
    const reports = await reporter.generateReports(results);
    results.reports = reports;
  }
  
  return results;
}

/**
 * Create a new security scanner instance
 * @param {Object} options - Configuration options
 * @returns {Promise<SecurityScanner>} Initialized security scanner instance
 */
async function createScanner(options = {}) {
  const scanner = new SecurityScanner(options);
  await scanner.init();
  return scanner;
}

/**
 * Create a new reporter instance
 * @param {Object} options - Reporter configuration
 * @returns {Reporter} Reporter instance
 */
function createReporter(options = {}) {
  return new Reporter(options);
}

module.exports = {
  scan,
  createScanner,
  createReporter,
  SecurityScanner,
  Reporter,
  Logger,
  utils: {
    // Export utility functions that might be useful for rule development
    loadRules: require('./rules/rules-loader').loadRules,
    BaseRule: require('./rules/base-rule').BaseRule
  }
};
