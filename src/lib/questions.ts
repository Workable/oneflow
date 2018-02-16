export const pullRequestQuestions = (title, body) => [
  {
    name: 'title',
    type: 'input',
    message: 'title?',
    default: title
  },
  {
    name: 'body',
    type: 'input',
    message: 'body?',
    default: body
  }
];

export const branchName = (name?, message = 'branch name?') => [
  {
    name: 'branchName',
    type: 'input',
    message,
    default: name
  }
];

export const tagName = (name, message = 'tag?') => ({
  name: 'tagName',
  type: 'input',
  message,
  default: name
});

export const confirm = (message = 'confirm?') => ({
  name: 'confirm',
  type: 'confirm',
  message,
  default: true
});

export const initializeConfig = config => [
  {
    name: 'BASE_BRANCH',
    type: 'input',
    message: 'base branch to close features, hotfixes, releases?',
    default: config.BASE_BRANCH
  },
  {
    name: 'MERGE_FF',
    type: 'input',
    message: 'merge branches during feature-close using --ff-only?',
    default: config.MERGE_FF
  },
  {
    name: 'FEATURE_CLOSE_REWRITE_COMMITS',
    type: 'input',
    message: 'Rewrite commits during feature-close to have as a prefix the feature-name?',
    default: config.FEATURE_CLOSE_REWRITE_COMMITS
  },
  {
    name: 'RUN_CMD_AFTER_TAG_CREATION',
    type: 'input',
    message: 'Run a command after creating a tag?',
    default: config.RUN_CMD_AFTER_TAG_CREATION
  },
  {
    name: 'CHANGE_VERSIONS_WHEN_TAGGING',
    type: 'confirm',
    message: 'Change versions when creating a tag (hotfix-close, release-close) currently supporting nodejs, java ?',
    default: config.CHANGE_VERSIONS_WHEN_TAGGING
  },
  {
    name: 'HOTFIX_CLOSE_REBASE_TO_LATEST_TAG',
    type: 'input',
    message: 'Rebase branch to latest tag during feature-close?',
    default: config.HOTFIX_CLOSE_REBASE_TO_LATEST_TAG
  },
  {
    name: 'PUSH_CHANGES_TO_REMOTE',
    type: 'input',
    message: 'Push changes to remote when possible?',
    default: config.PUSH_CHANGES_TO_REMOTE
  },
  {
    name: 'MERGE_INTERACTIVE',
    type: 'input',
    message: 'Merge interactively during feature-close, hotfix-close?',
    default: config.MERGE_INTERACTIVE
  },
  {
    name: 'FEATURE_CLOSE_SQUASH',
    type: 'input',
    message: 'Squash commits during feature close to one commit?',
    default: config.FEATURE_CLOSE_SQUASH
  },
  {
    name: 'RELEASE_CREATE_AND_CLOSE',
    type: 'input',
    message: 'Release create will also close it immediately updating versions and creating tags?',
    default: config.RELEASE_CREATE_AND_CLOSE
  },
  {
    name: 'RELEASE_CLOSE_MERGES_TO_BASE_BRANCH',
    type: 'input',
    message:
      'Release close will merge changes to base branch. Choose no if you want to merge manually (eg. to run tests first).',
    default: config.RELEASE_CLOSE_MERGES_TO_BASE_BRANCH
  },
  {
    name: 'DEBUG',
    type: 'input',
    message: 'Show debug information.',
    default: config.DEBUG
  }
];
