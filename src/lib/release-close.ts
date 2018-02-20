import exec from './exec';
import * as chalk from 'chalk';
import { merge, pushBranchToRemoteAndDelete, getTagPrompt, createTag, getReleaseName } from './helpers';
import { getConfig } from './config';

export default async function releaseClose(tag, options) {
  const config = getConfig(options);

  tag = await getTagPrompt(tag, 'release tag?', 'minor');
  const releaseName = getReleaseName(tag);
  await createTag(tag, releaseName);

  if (!config.RELEASE_CLOSE_MERGES_TO_BASE_BRANCH) {
    return;
  }
  await merge(releaseName, config.BASE_BRANCH, { enforceFF: false });

  console.log(config.PUSH_CHANGES_TO_REMOTE);
  const pushed = await pushBranchToRemoteAndDelete(releaseName, config.PUSH_CHANGES_TO_REMOTE);

  console.log(chalk.blue(`${config.BASE_BRANCH} is on tag ${tag}`));
  await exec(`git checkout ${config.BASE_BRANCH}`);

  console.log(
    chalk.blue(`Switched to branch ${getConfig().BASE_BRANCH}

Summary of actions:
 - Latest changes were fetched from remote
 - Release was tagged '${tag}'
 - Branch ${releaseName} was merged into ${getConfig().BASE_BRANCH}
 ${pushed ? `- Branch ${releaseName} was deleted and changes were pushed to remote` : ''}
 - You are now on branch ${getConfig().BASE_BRANCH}
  `)
  );
}
