import exec from './exec';
import { getTagPrompt, getReleaseName } from './helpers';
import featureCreate from './feature-create';
import releaseClose from './release-close';
import { getConfig } from './config';

export default async function releaseCreate(commit = getConfig().BASE_BRANCH, tag, options) {
  const config = getConfig(options);

  exec('git fetch origin --tags --prune');
  tag = await getTagPrompt(tag, 'release tag?', 'minor');

  await featureCreate(getReleaseName(tag), {
    push: config.PUSH_CHANGES_TO_REMOTE || config.RELEASE_CREATE_AND_CLOSE,
    releaseFrom: commit
  });

  if (config.RELEASE_CREATE_AND_CLOSE) {
    await releaseClose(tag, options);
  }
}
