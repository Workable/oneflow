import exec from './exec';
import * as chalk from 'chalk';
import { merge, pushBranchToRemoteAndDelete,  getTagPrompt, createTag, getReleaseName } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function releaseClose(tag, options) {
  tag = await getTagPrompt(tag, 'release tag?', 'minor');
  await createTag(tag);

  merge(getReleaseName(tag), config.BASE_BRANCH);

  await pushBranchToRemoteAndDelete(getReleaseName(tag), options.forcePush);

  console.log(chalk.blue(`${config.BASE_BRANCH} is on tag ${tag}`));
  await exec(`git checkout ${config.BASE_BRANCH}`);
}
