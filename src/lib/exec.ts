import * as chalk from 'chalk';
import { execSync } from 'child_process';

export default function exec(str, { log = true, interactive = false, exit = true } = {}) {
  log && console.log(chalk.yellow(`-> ${str}`));
  const options = { stdio: interactive ? 'inherit' : 'pipe' };
  try {
    const output = execSync(str, options);
    if (output) {
      return output.toString().trim();
    }
  } catch (e) {
    console.log((exit && chalk.red(e)) || chalk.magenta(e));
    exit && runRevert();
    exit && process.exit(1);
  }
}

const cmds = [];
export function revert(cmd) {
  if (cmds.indexOf(cmd) === -1) {
    cmds.unshift(cmd);
  }
}

function runRevert() {
  for (const cmd of cmds) {
    exec(cmd);
  }
}
