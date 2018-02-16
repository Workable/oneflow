import * as chalk from 'chalk';
import { execSync } from 'child_process';
import { getConfig, resolvePath } from './config';
import * as fs from 'fs';

const debug = getConfig().DEBUG || process.env.DRY_RUN === 'true';
const debugCmds = [];
export default function exec(str, { log = true, interactive = false, exit = true, recover = null, input = null } = {}) {
  if (debug) {
    log && console.log(chalk.yellow(`-> ${str}`));
  } else {
    debugCmds.push(chalk.yellow(`-> ${str}`));
  }
  const options = { stdio: interactive ? 'inherit' : 'pipe', input };

  if (process.env.DRY_RUN === 'true') {
    return;
  }

  try {
    const output = execSync(str, options);
    if (output) {
      return output.toString().trim();
    }
  } catch (e) {
    console.log((exit && chalk.red(e)) || chalk.magenta(e));
    debugCmds.push(chalk.red(e));
    if (!exit && recover) {
      return recover().then(() => exec(str, { log, interactive, exit, recover }));
    }

    if (exit) {
      runRevert();
      console.log(chalk.blue('Debug information saved in .debug-oneflow'));
      debugCmds.push(chalk.blue(new Date().toString()));
      fs.appendFileSync(resolvePath('.debug-oneflow'), debugCmds.join('\n') + '\n');
      process.exit(1);
    }
  }
}

const cmds = [];
export function revert(cmd) {
  if (cmds.indexOf(cmd) === -1) {
    cmds.unshift(cmd);
  }
}

export function runRevert() {
  for (const cmd of cmds) {
    exec(cmd, { exit: false });
  }
}
