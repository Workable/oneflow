import exec from './exec';
import { getTagPrompt, getReleaseName } from './helpers';
import featureCreate from './feature-create';

export default async function releaseCreate(tag, options) {
  exec('git fetch origin --tags --prune');
  tag = await getTagPrompt(tag, 'release tag?', 'minor');

  await featureCreate(getReleaseName(tag));
}
