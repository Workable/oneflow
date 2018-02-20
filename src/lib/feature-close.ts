import * as chalk from 'chalk';
import { getBranchPrompt, merge, pushBranchToRemoteAndDelete } from './helpers';
import { getConfig } from './config';

export default async function featureClose(branch, options) {
  branch = await getBranchPrompt(branch);

  const {
    BASE_BRANCH,
    MERGE_FF,
    FEATURE_CLOSE_REWRITE_COMMITS,
    MERGE_INTERACTIVE,
    FEATURE_CLOSE_SQUASH,
    PUSH_CHANGES_TO_REMOTE
  } = getConfig(options);

  await merge(branch, BASE_BRANCH, {
    noff: !MERGE_FF,
    rebase: true,
    rewriteCommits: FEATURE_CLOSE_REWRITE_COMMITS,
    interactive: MERGE_INTERACTIVE,
    squash: FEATURE_CLOSE_SQUASH
  });

  const pushed = await pushBranchToRemoteAndDelete(branch, PUSH_CHANGES_TO_REMOTE);

  console.log(
    chalk.blue(`Switched to branch ${getConfig().BASE_BRANCH}

Summary of actions:
 - Latest changes were fetched from remote
 - Branch ${branch} was merged into ${getConfig().BASE_BRANCH}
 ${pushed ? `- Branch ${branch} was deleted and changes were pushed to remote` : ''}
 - You are now on branch ${getConfig().BASE_BRANCH}
  `)
  );
}
