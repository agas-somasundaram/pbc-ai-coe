const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { BaseRule } = require('./base-rule');

async function loadRules(rulesDir) {
  const rules = [];
  
  // Load built-in rules
  const builtInRules = await loadRulesFromDir(
    path.join(__dirname, 'rules')
  );
  rules.push(...builtInRules);

  // Load custom rules if directory exists
  if (fs.existsSync(rulesDir)) {
    const customRules = await loadRulesFromDir(rulesDir);
    rules.push(...customRules);
  }

  return rules;
}

async function loadRulesFromDir(dir) {
  const rules = [];
  
  try {
    const ruleFiles = await glob('**/*.js', { 
      cwd: dir, 
      absolute: true,
      ignore: ['**/node_modules/**']
    });

    for (const file of ruleFiles) {
      try {
        // Skip the base rule file
        if (file.endsWith('base-rule.js') || file.endsWith('rules-loader.js')) {
          continue;
        }

        // Load the rule module
        const ruleModule = require(file);
        
        // Handle both ES modules and CommonJS
        const ruleClass = ruleModule.default || ruleModule;
        
        // If it's a rule class, instantiate it
        if (ruleClass.prototype instanceof BaseRule) {
          rules.push(new ruleClass());
        } 
        // If it's a rule definition object, create a rule from it
        else if (typeof ruleClass === 'object') {
          rules.push(BaseRule.create(ruleClass));
        }
        // If it's an array of rules
        else if (Array.isArray(ruleClass)) {
          ruleClass.forEach(ruleDef => {
            if (typeof ruleDef === 'function') {
              rules.push(new ruleDef());
            } else {
              rules.push(BaseRule.create(ruleDef));
            }
          });
        }
      } catch (error) {
        console.error(`Error loading rule from ${file}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error loading rules from ${dir}:`, error);
  }

  return rules;
}

module.exports = {
  loadRules,
  loadRulesFromDir
};
