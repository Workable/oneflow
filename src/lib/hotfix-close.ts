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
import { getConfig } from './config';

export default async function hotfixClose(branch, tag, options) {
  const config = getConfig(options);
  exec('git fetch origin --tags --prune');
  const latestTagCommit = exec('git rev-list --tags --max-count=1', { log: false });
  const latestTag = exec(`git describe --tags ${latestTagCommit}`, { log: false });

  branch = await getBranchPrompt(branch);
  tag = await getTagPrompt(tag, 'create tag?', 'patch');

  exec(`git checkout ${branch}`);
  revertBranch(branch);
  exec('git pull', { exit: false });
  if (config.HOTFIX_CLOSE_REBASE_TO_LATEST_TAG) {
    revert('git rebase --abort');
    const interactive =
      config.MERGE_INTERACTIVE ||
      parseInt(exec(`git log --oneline refs/tags/${latestTag}..${branch}|grep fixup|wc -l`), 10) > 0;
    await exec(`git rebase ${interactive ? '-i' : ''} refs/tags/${latestTag} ${interactive ? '--autosquash' : ''}`, {
      interactive,
      exit: false,
      recover: recover('Rebase conflict exists. Please fix your conflicts.')
    });
  }

  await createTag(tag, branch);

  exec(`git checkout ${getConfig().BASE_BRANCH}`);
  exec('git pull');
  revert(`git reset --hard HEAD`);
  await exec(`git merge refs/heads/${branch}`, {
    exit: false,
    recover: recover('Merge conflict exists. Please fix your conflicts.')
  });

  await pushBranchToRemoteAndDelete(branch, config.PUSH_CHANGES_TO_REMOTE);
  console.log(chalk.blue(`closed hotfix ${branch} to ${config.BASE_BRANCH} creating tag ${tag}`));
}
