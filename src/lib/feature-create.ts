import exec, { revert } from './exec';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import { branchName } from './questions';
import { getCurrentBranch, pushToRemote } from './helpers';
import { getConfig } from './config';

export default async function featureCreate(branch, options) {
  if (!branch) {
    ({ branchName: branch } = await inquirer.prompt(branchName()));
  }
  const { BASE_BRANCH: base, PUSH_CHANGES_TO_REMOTE } = getConfig(options);
  const checkoutBranch = options.releaseFrom || base;
  exec(`git checkout ${checkoutBranch}`);
  checkoutBranch === base && exec('git pull');
  exec(`git checkout -b ${branch};`);
  revert(`git checkout ${base} && git branch -d ${branch}`);
  await pushToRemote(PUSH_CHANGES_TO_REMOTE, false, branch);

  if (options.log === false) {
    return;
  }

  console.log(
    chalk.blue(`Switched to a new branch ${getCurrentBranch()}

Summary of actions:
 - A new branch '${getCurrentBranch()}' was created, based on '${base}'
 - You are now on branch '${getCurrentBranch()}'

Now, start committing on your feature. When done, use:

  oneflow feature-close ${getCurrentBranch()}
  `)
  );
}
