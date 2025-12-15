#!/usr/bin/env node

/**
 * Initialization script for Security Scanner Framework
 * Creates necessary files and directories in the target project
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function init() {
  console.log('🔒 Security Scanner Framework - Initialization\n');
  
  const targetDir = process.cwd();
  console.log(`Target directory: ${targetDir}\n`);
  
  // Ask configuration questions
  const projectType = await question(
    'Project type? (1: React, 2: Node/Express, 3: Next.js, 4: Vue, 5: Custom): '
  );
  
  const includePatterns = getIncludePatterns(projectType);
  const excludePatterns = getExcludePatterns(projectType);
  
  const customRules = await question('Create custom rules directory? (y/n): ');
  const rulesDir = customRules.toLowerCase() === 'y' ? '.security/rules' : '.windsurf/rules';
  
  const cicd = await question('Set up CI/CD integration? (1: GitHub Actions, 2: GitLab CI, 3: None): ');
  
  // Create configuration file
  const config = {
    rulesDir,
    include: includePatterns,
    exclude: excludePatterns,
    scanOptions: {
      severity: ['critical', 'high', 'medium', 'low']
    },
    reporter: {
      outputDir: './security-audit',
      formats: ['markdown', 'html', 'json']
    },
    logger: {
      level: 'info',
      silent: false
    }
  };
  
  const configPath = path.join(targetDir, '.securityrc.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Created ${configPath}`);
  
  // Create rules directory if requested
  if (customRules.toLowerCase() === 'y') {
    const rulesDirPath = path.join(targetDir, rulesDir);
    if (!fs.existsSync(rulesDirPath)) {
      fs.mkdirSync(rulesDirPath, { recursive: true });
      console.log(`✅ Created ${rulesDirPath}`);
      
      // Create example rule
      const exampleRule = `const { BaseRule } = require('@your-org/security-scanner');

class ExampleCustomRule extends BaseRule {
  constructor() {
    super({
      id: 'CUSTOM-001',
      name: 'Example Custom Rule',
      severity: 'medium',
      description: 'This is an example custom security rule',
      recommendation: 'Follow your organization security guidelines',
      metadata: {
        category: 'custom',
        ciaImpact: 'Confidentiality'
      }
    });
  }

  detect(content, filePath) {
    // Add your custom detection logic here
    const findings = [];
    
    // Example: detect a specific pattern
    if (content.includes('EXAMPLE_PATTERN')) {
      findings.push({
        line: this.getLineNumber(content, content.indexOf('EXAMPLE_PATTERN')),
        match: 'EXAMPLE_PATTERN'
      });
    }
    
    return findings;
  }

  appliesTo(filePath) {
    // Only check JavaScript/TypeScript files
    return /\\.(js|ts|jsx|tsx)$/.test(filePath);
  }
}

module.exports = ExampleCustomRule;
`;
      
      fs.writeFileSync(
        path.join(rulesDirPath, 'example-rule.js'),
        exampleRule
      );
      console.log(`✅ Created example rule in ${rulesDirPath}/example-rule.js`);
    }
  }
  
  // Update package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['security'] = 'security-scan';
    packageJson.scripts['security:ci'] = 'security-scan --exit-code --format json';
    packageJson.scripts['security:report'] = 'security-scan --html --markdown';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with security scripts');
  }
  
  // Create CI/CD configuration
  if (cicd === '1') {
    createGitHubActions(targetDir);
  } else if (cicd === '2') {
    createGitLabCI(targetDir);
  }
  
  // Create .gitignore entry
  const gitignorePath = path.join(targetDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    let gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('security-audit')) {
      gitignore += '\n# Security scan reports\nsecurity-audit/\n';
      fs.writeFileSync(gitignorePath, gitignore);
      console.log('✅ Updated .gitignore');
    }
  }
  
  console.log('\n✨ Initialization complete!\n');
  console.log('Next steps:');
  console.log('1. Run: npm run security');
  console.log('2. Review: security-audit/security-report.html');
  console.log('3. Customize: .securityrc.json');
  if (customRules.toLowerCase() === 'y') {
    console.log(`4. Add custom rules: ${rulesDir}/`);
  }
  console.log('\n📚 Documentation: https://github.com/your-org/security-scanner\n');
  
  rl.close();
}

function getIncludePatterns(projectType) {
  const patterns = {
    '1': ['src/**/*.{js,jsx,ts,tsx}'], // React
    '2': ['src/**/*.js', 'routes/**/*.js', 'controllers/**/*.js'], // Node/Express
    '3': ['pages/**/*.{js,jsx,ts,tsx}', 'components/**/*.{js,jsx,ts,tsx}', 'lib/**/*.{js,ts}'], // Next.js
    '4': ['src/**/*.{js,ts,vue}'], // Vue
    '5': ['**/*.{js,jsx,ts,tsx}'] // Custom
  };
  return patterns[projectType] || patterns['5'];
}

function getExcludePatterns(projectType) {
  return [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/coverage/**'
  ];
}

function createGitHubActions(targetDir) {
  const workflowDir = path.join(targetDir, '.github', 'workflows');
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }
  
  const workflow = `name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security scan
        run: npm run security:ci
        continue-on-error: true
      
      - name: Upload security reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: security-reports
          path: security-audit/
          retention-days: 30
`;
  
  fs.writeFileSync(
    path.join(workflowDir, 'security-scan.yml'),
    workflow
  );
  console.log('✅ Created GitHub Actions workflow');
}

function createGitLabCI(targetDir) {
  const gitlabCI = `stages:
  - security

security_scan:
  stage: security
  image: node:18
  script:
    - npm ci
    - npm run security:ci
  artifacts:
    when: always
    paths:
      - security-audit/
    expire_in: 30 days
  only:
    - merge_requests
    - main
    - develop
`;
  
  fs.writeFileSync(
    path.join(targetDir, '.gitlab-ci.yml'),
    gitlabCI
  );
  console.log('✅ Created GitLab CI configuration');
}

// Run initialization
init().catch(error => {
  console.error('❌ Initialization failed:', error);
  process.exit(1);
});
