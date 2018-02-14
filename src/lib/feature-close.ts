import * as chalk from 'chalk';
import { getBranchPrompt, merge, pushBranchToRemoteAndDelete } from './helpers';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

function useDefault(d, value = d) {
  return value;
}

export default async function featureClose(branch, options) {
  branch = await getBranchPrompt(branch);

  await merge(branch, config.BASE_BRANCH, {
    noff: !options.ff || config.NO_FF,
    rebase: true,
    rewriteCommits: useDefault(options.rewriteHistory && config.REWRITE_COMMITS, options.rewrite),
    interactive: options.interactive,
    squash: options.squash
  });

  await pushBranchToRemoteAndDelete(branch, options.forcePush);

  console.log(chalk.blue(`closed feature ${branch} to ${config.BASE_BRANCH}`));
}
