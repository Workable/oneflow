import * as chalk from 'chalk';
import { getBranchPrompt, merge, pushBranchToRemoteAndDelete } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function featureClose(branch, options) {
  branch = await getBranchPrompt(branch);

  merge(branch, config.BASE_BRANCH, config.NO_FF, true, config.REWRITE_COMMITS && !options.stopRewrite);

  await pushBranchToRemoteAndDelete(branch, options.forcePush);

  console.log(chalk.blue(`closed feature ${branch} to ${config.BASE_BRANCH}`));
}
