import exec from './exec';
import * as chalk from 'chalk';
import { createTag, pushBranchToRemoteAndDelete, getBranchPrompt, getTagPrompt, revertBranch } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function hotfixClose(branch, tag, options) {
  exec('git fetch origin --tags --prune');
  const latestTagCommit = exec('git rev-list --tags --max-count=1', { log: false });
  const latestTag = exec(`git describe --tags ${latestTagCommit}`, { log: false });

  branch = await getBranchPrompt(branch);
  tag = await getTagPrompt(tag, 'create tag?', 'patch');

  exec(`git checkout ${branch}`);
  revertBranch(branch);
  exec('git pull', { exit: false });
  exec(`git rebase refs/tags/${latestTag}`);

  await createTag(tag, branch);

  exec(`git checkout ${config.BASE_BRANCH}`);
  exec('git pull');
  exec(`git merge ${branch}`);

  await pushBranchToRemoteAndDelete(branch, options.forcePush);
  console.log(chalk.blue(`closed hotfix ${branch} to ${config.BASE_BRANCH} creating tag ${tag}`));
}
