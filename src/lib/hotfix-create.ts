import exec from './exec';
import * as chalk from 'chalk';
import { getBranchPrompt, getTagPrompt, getCurrentBranch, pushToRemote } from './helpers';
import * as semver from 'semver';
import { getConfig } from './config';

export default async function hotfixCreate(branch, tag, options) {
  const config = getConfig(options);
  exec('git fetch origin --tags --prune');
  tag = await getTagPrompt(tag, 'checkout tag?');
  branch = await getBranchPrompt(branch, semver.inc(tag, 'patch'));

  exec(`git checkout -b ${branch} refs/tags/${tag}`);
  await pushToRemote(config.PUSH_CHANGES_TO_REMOTE, false, branch);

  console.log(
    chalk.blue(`Switched to a new branch ${getCurrentBranch()}

Summary of actions:
 - A new branch ${getCurrentBranch()} was created base on tag ${tag}
 - You are now on branch ${getCurrentBranch()}

 Now, start committing on your hotfix. When done, use:

   oneflow hotfix-close ${getCurrentBranch()}

This will handle version changes (for node, java sourcecoeds) and tag creation.
  `)
  );
}
