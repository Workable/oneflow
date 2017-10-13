import exec from './exec';
import { getTagPrompt, getReleaseName } from './helpers';
import featureCreate from './feature-create';
import releaseClose from './release-close';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

export default async function releaseCreate(commit = config.BASE_BRANCH, tag, options) {
  exec('git fetch origin --tags --prune');
  tag = await getTagPrompt(tag, 'release tag?', 'minor');

  await featureCreate(getReleaseName(tag), { forcePush: options.forcePush || options.close, releaseFrom: commit });

  if (options.close) {
    await releaseClose(tag, options);
  }
}
