import exec from './exec';
import * as chalk from 'chalk';
import { merge, pushBranchToRemoteAndDelete, getTagPrompt, createTag, getReleaseName } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function releaseClose(tag, options) {
  tag = await getTagPrompt(tag, 'release tag?', 'minor');
  const releaseName = getReleaseName(tag);
  await createTag(tag, releaseName);

  if (!options.merge) {
    return;
  }
  merge(releaseName, config.BASE_BRANCH);

  await pushBranchToRemoteAndDelete(releaseName, options.forcePush);

  console.log(chalk.blue(`${config.BASE_BRANCH} is on tag ${tag}`));
  await exec(`git checkout ${config.BASE_BRANCH}`);
}
