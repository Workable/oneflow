import exec, { revert } from './exec';
import * as chalk from 'chalk';
import {
  createTag,
  pushBranchToRemoteAndDelete,
  getBranchPrompt,
  getTagPrompt,
  revertBranch,
  recover
} from './helpers';
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
  if (options.rebase) {
    exec(`git rebase refs/tags/${latestTag}`);
  }

  await createTag(tag, branch);

  exec(`git checkout ${config.BASE_BRANCH}`);
  exec('git pull');
  revert(`git reset --hard HEAD`);
  await exec(`git merge refs/heads/${branch}`, {
    exit: false,
    recover: recover('Merge conflict exists. Please fix your conflicts.')
  });

  await pushBranchToRemoteAndDelete(branch, options.forcePush);
  console.log(chalk.blue(`closed hotfix ${branch} to ${config.BASE_BRANCH} creating tag ${tag}`));
}
