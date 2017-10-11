import exec from './exec';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import { branchName } from './questions';
import { getCurrentBranch, pushToRemote } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function featureCreate(branch) {
  if (!branch) {
    ({ branchName: branch } = await inquirer.prompt(branchName()));
  }
  exec(`git checkout ${config.BASE_BRANCH}`);
  exec('git pull');
  exec(`git checkout -b ${branch};`);
  await pushToRemote(false, false, branch);
  console.log(chalk.blue(`currently in branch ${getCurrentBranch()}`));
}
