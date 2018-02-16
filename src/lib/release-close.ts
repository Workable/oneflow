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
  await pushBranchToRemoteAndDelete(releaseName, config.PUSH_CHANGES_TO_REMOTE);

  console.log(chalk.blue(`${config.BASE_BRANCH} is on tag ${tag}`));
  await exec(`git checkout ${config.BASE_BRANCH}`);
}
