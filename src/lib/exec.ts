import * as chalk from 'chalk';
import { execSync } from 'child_process';

export default function(str, log = true, interactive = false) {
  log && console.log(chalk.yellow(`-> ${str}`));
  const options = { stdio: interactive ? 'inherit' : 'pipe' };
  try {
    const output = execSync(str, options);
    if (output) {
      return output.toString().trim();
    }
  } catch (e) {
    console.log(chalk.red(e));
    process.exit(1);
  }
}
