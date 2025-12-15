const chalk = require('chalk');
const { EOL } = require('os');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

class Logger {
  constructor(config = {}) {
    this.config = {
      level: process.env.LOG_LEVEL || 'info',
      silent: false,
      ...config.logger
    };
    
    this.level = this.config.level.toLowerCase();
    this.silent = this.config.silent;
  }

  error(...args) {
    this.log('error', ...args);
  }

  warn(...args) {
    this.log('warn', ...args);
  }

  info(...args) {
    this.log('info', ...args);
  }

  debug(...args) {
    this.log('debug', ...args);
  }

  log(level, ...args) {
    if (this.silent || LOG_LEVELS[level] > LOG_LEVELS[this.level]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    let coloredPrefix;
    switch (level) {
      case 'error':
        coloredPrefix = chalk.red(prefix);
        break;
      case 'warn':
        coloredPrefix = chalk.yellow(prefix);
        break;
      case 'info':
        coloredPrefix = chalk.blue(prefix);
        break;
      case 'debug':
        coloredPrefix = chalk.gray(prefix);
        break;
      default:
        coloredPrefix = prefix;
    }

    // Format each argument
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    });

    // Write to stderr for errors, stdout for everything else
    const output = level === 'error' ? process.stderr : process.stdout;
    output.write(`${coloredPrefix} ${formattedArgs.join(' ')}${EOL}`);
  }

  // Progress bar implementation
  createProgressBar(total, width = 40) {
    let current = 0;
    const startTime = Date.now();
    
    const render = () => {
      if (this.silent) return;
      
      const percent = Math.min(100, Math.floor((current / total) * 100));
      const filled = Math.floor((width * percent) / 100);
      const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      
      process.stdout.write("  " + 
        `${bar} ${percent}% | ${current}/${total} files | ${elapsed}s` + 
        (current >= total ? '\n' : '')
      );
    };
    
    return {
      increment: () => {
        current++;
        render();
      },
      complete: () => {
        current = total;
        render();
      }
    };
  }
}

module.exports = { Logger };
