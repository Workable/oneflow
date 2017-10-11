import * as chalk from 'chalk';
import { execSync as execCb } from 'child_process';

export default function(str, log = true, interactive = false) {
  log && console.log(chalk.yellow(`-> ${str}`));
  const options = { stdio: interactive ? 'inherit' : 'pipe' };
  try {
    const output = execCb(str, options);
    if (output) {
      return output.toString().trim();
    }
  } catch (e) {
    console.log(chalk.red(e));
    process.exit(-1);
  }
}
