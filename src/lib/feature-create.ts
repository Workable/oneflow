import exec from './exec';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import { branchName } from './questions';
import { getCurrentBranch, pushToRemote } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function featureCreate(branch, options) {
  if (!branch) {
    ({ branchName: branch } = await inquirer.prompt(branchName()));
  }
  const checkoutBranch = options.releaseFrom || config.BASE_BRANCH;
  exec(`git checkout ${checkoutBranch}`);
  checkoutBranch === config.BASE_BRANCH && exec('git pull');
  exec(`git checkout -b ${branch};`);
  await pushToRemote(options.forcePush, false, branch);
  console.log(chalk.blue(`currently in branch ${getCurrentBranch()}`));
}
