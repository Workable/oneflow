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
  default: false
});

export const initializeConfig = config => [
  {
    name: 'BASE_BRANCH',
    type: 'input',
    message: 'base branch to close features, hotfixes, releases?',
    default: config.BASE_BRANCH
  },
  {
    name: 'NO_FF',
    type: 'input',
    message: 'merge branches (during feature-close, release-close, hotfix-close) using --no-ff?',
    default: config.NO_FF
  },
  {
    name: 'REWRITE_COMMITS',
    type: 'input',
    message: 'Rewrite commits (during feature-close) to have as a prefix the feature-name?',
    default: config.REWRITE_COMMITS
  },
  {
    name: 'RUN_CMD_AFTER_TAG_CREATION',
    type: 'input',
    message: 'Run a command after creating a tag?',
    default: config.RUN_CMD_AFTER_TAG_CREATION
  }
];
