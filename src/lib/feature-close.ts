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

  await pushBranchToRemoteAndDelete(branch, PUSH_CHANGES_TO_REMOTE);

  console.log(chalk.blue(`closed feature ${branch} to ${getConfig().BASE_BRANCH}`));
}
