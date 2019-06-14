import homeConfig from 'home-config';
import path from 'path';
import packageJson from '../../package.json';

export const configName = `.${packageJson.name.split('/').pop()}rc`;
const config = homeConfig.load(configName);
const localConfig = homeConfig.load(path.resolve(process.cwd(), configName));

export const resolvePath = p => path.resolve(process.cwd(), p);
export const options = {
  push: 'PUSH_CHANGES_TO_REMOTE',
  rebase: 'HOTFIX_CLOSE_REBASE_TO_LATEST_TAG',
  interactive: 'MERGE_INTERACTIVE',
  rewrite: 'FEATURE_CLOSE_REWRITE_COMMITS',
  ff: 'MERGE_FF',
  squash: 'FEATURE_CLOSE_SQUASH',
  close: 'RELEASE_CREATE_AND_CLOSE',
  merge: 'RELEASE_CLOSE_MERGES_TO_BASE_BRANCH'
};

export function getProjectConfig(argOptions) {
  const configFromArgs = Object.keys(argOptions).reduce((v, key) => {
    if (options[key] && argOptions[key]) {
      return { ...v, [options[key]]: true };
    }

    const noKey = key.replace('Flag', '');
    if (options[noKey] && !argOptions[key]) {
      return { ...v, [options[noKey]]: false };
    }
    return v;
  }, {});
  return { ...localConfig, ...configFromArgs };
}

export declare type CONFIG = {
  PUSH_CHANGES_TO_REMOTE: boolean;
  HOTFIX_CLOSE_REBASE_TO_LATEST_TAG: boolean;
  MERGE_INTERACTIVE: boolean;
  FEATURE_CLOSE_REWRITE_COMMITS: boolean;
  MERGE_FF: boolean;
  FEATURE_CLOSE_SQUASH: boolean;
  RELEASE_CREATE_AND_CLOSE: boolean;
  RELEASE_CLOSE_MERGES_TO_BASE_BRANCH: boolean;
  DEBUG: boolean;
  BASE_BRANCH: string;
  RUN_CMD_AFTER_TAG_CREATION: string;
  CHANGE_VERSIONS_WHEN_TAGGING: boolean;
  GET_VERSION: string;
  LAST_CHECKED: Date;
  initialized: boolean;
  BUGFIX_PREFIX: string;
  FEATURE_PREFIX: string;
};

export function getConfig(argOptions = {}): CONFIG {
  return { ...config, ...getProjectConfig(argOptions) };
}

export function save(options) {
  Object.assign(config, options);
  config.save();
}
