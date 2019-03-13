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
  const latestTag = exec(`git describe --tags --match "v[0-9]*" ${latestTagCommit}`, { log: false });

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

  const pushed = await pushBranchToRemoteAndDelete(branch, config.PUSH_CHANGES_TO_REMOTE);
  console.log(
    chalk.blue(`Switched to branch ${config.BASE_BRANCH}

Summary of actions:
- Latest changes were fetched from remote
${config.HOTFIX_CLOSE_REBASE_TO_LATEST_TAG ? `- rebased hotfix to latest tag ${latestTag}` : ''}
- Hotfix was tagged '${tag}'
- Hotfix branch ${branch} was merged into ${getConfig().BASE_BRANCH}
${pushed ? `- Branch ${branch} was deleted and changes were pushed to remote` : ''}
- You are now on branch ${getConfig().BASE_BRANCH}
  `)
  );
}
