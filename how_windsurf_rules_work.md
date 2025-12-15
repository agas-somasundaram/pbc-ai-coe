# How Windsurf Actually Uses Rule Files

## Rule Loading Priority

### 1. Global Rules
- **Location**: Always loaded
- **Purpose**: Apply universally across all projects and directories
- **Usage**: Applied early in the reasoning process

### 2. .windsurfrules
- **Location**: Project root
- **Purpose**: Central configuration file that tells Windsurf what rules to load and how to apply them
- **Behavior**: Acts as the main index for rule loading

### 3. .windsurf/rules/*.md
- **Location**: .windsurf/rules/ directory
- **Purpose**: Contains modular rule definitions
- **Important Notes**:
  - Files are only loaded when explicitly instructed
  - Not all files are guaranteed to be read automatically
  - Explicit configuration is required for full utilization

### 4. Activation Mode
- **Type**: Model Decision
- **How It Works**:
  - Model evaluates when and how to apply each rule file
  - Decision based on:
    - Rule file description
    - Content context
    - Current task requirements

## Key Takeaway
- **Rule Descriptions Matter**: Clear, descriptive content in rule files is crucial
- **Explicit > Implicit**: Be specific about which rules to apply
- **Context is Key**: The model uses the surrounding context to determine rule applicability