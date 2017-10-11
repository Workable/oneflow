import exec from './exec';
import * as chalk from 'chalk';
import { getBranchPrompt, getTagPrompt, getCurrentBranch, pushToRemote } from './helpers';
import * as semver from 'semver';

export default async function hotfixCreate(branch, tag) {
  exec('git fetch origin --tags --prune');
  tag = await getTagPrompt(tag, 'checkout tag?');
  console.log(tag, semver.inc(tag, 'patch'));
  branch = await getBranchPrompt(branch, semver.inc(tag, 'patch'));

  exec(`git checkout -b ${branch} refs/tags/${tag}`);
  await pushToRemote(false, false, branch);

  console.log(chalk.blue(`currently in branch ${getCurrentBranch()}`));
}
