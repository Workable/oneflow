import exec from './exec';
import { getTagPrompt, getReleaseName, getCurrentBranch } from './helpers';
import featureCreate from './feature-create';
import releaseClose from './release-close';
import { getConfig } from './config';
import chalk from 'chalk';

export default async function releaseCreate(commit = getConfig().BASE_BRANCH, tag, options) {
  const config = getConfig(options);

  exec('git fetch origin --tags --prune');
  tag = await getTagPrompt(tag, 'release tag?', 'minor');

  await featureCreate(getReleaseName(tag), {
    push: config.PUSH_CHANGES_TO_REMOTE || config.RELEASE_CREATE_AND_CLOSE,
    releaseFrom: commit,
    log: false
  });

  if (config.RELEASE_CREATE_AND_CLOSE) {
    await releaseClose(tag, options);
  } else {
    console.log(
      chalk.blue(`Switched to a new branch ${getCurrentBranch()}

Summary of actions:
 - A new branch '${getCurrentBranch()}' was created, based on '${config.BASE_BRANCH}'
 - You are now on branch '${getCurrentBranch()}'

Now, start committing on your release. When done, use:

  oneflow release-close ${tag}
    `)
    );
  }
}
