import initialize from './initialize';
import { getConfig, options } from './config';
import * as program from 'commander';
import * as taptapCommander from 'commander-tabtab';
import hotfixCreate from './hotfix-create';
import hotfixClose from './hotfix-close';
import bugfixCreate from './bugfix-create';
import bugfixClose from './bugfix-close';
import featureCreate from './feature-create';
import featureClose from './feature-close';
import releaseCreate from './release-create';
import releaseClose from './release-close';
import { hasVersionChanged } from './helpers';

function init() {
  if (!getConfig().initialized) {
    initialize();
    return;
  }

  const packageJson = require('../../package.json');

  const wrap = fn => async (...args) => {
    await hasVersionChanged();
    await fn(...args);
  };

  program.constructor.prototype.addOption = function(param, positive, negative) {
    const arg = getConfig()[options[param]];
    if (arg || process.env.NODE_ENV === 'test') {
      this.option(`-${param.substring(0, 1).toUpperCase()}, --no-${param}-flag`, negative);
    }
    if (!arg || process.env.NODE_ENV === 'test') {
      this.option(`-${param.substring(0, 1)}, --${param}`, positive);
    }
    return this;
  };

  program
    .command('hotfix-create [branch] [from-tag]')
    .description('Create locally a hotfix branch from latest tag')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .action(wrap(hotfixCreate));

  program
    .command('hotfix-close [branch] [tag]')
    .description('Close a hotfix branch from latest tag to master creating a tag')
    .addOption('interactive', 'Interactive rebase', 'No nteractive rebase')
    .addOption('rebase', 'Will rebase to latest hotfix', 'Will not rebase to latest hotfix')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .action(wrap(hotfixClose));

  program
    .command('bugfix-create [branch]')
    .description('Create locally a bugfix branch from latest master')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .action(wrap(bugfixCreate));

  program
    .command('bugfix-close [branch]')
    .description('Close a bugfix branch to master')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .addOption('interactive', 'Interactive rebase', 'No nteractive rebase')
    .addOption('rewrite', 'Will rewrite commit messages with feature as prefix.', 'Will not rewrite commits')
    .addOption('ff', 'Will run merge with ff-only', 'Will run merge with no-ff')
    .addOption('squash', 'Will squash commits into 1', 'Will not squash commits into 1')
    .action(wrap(bugfixClose));

  program
    .command('feature-create [branch]')
    .description('Create locally a feature branch from latest master')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .action(wrap(featureCreate));

  program
    .command('feature-close [branch]')
    .description('Close a feature branch to master')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .addOption('interactive', 'Interactive rebase', 'No nteractive rebase')
    .addOption('rewrite', 'Will rewrite commit messages with feature as prefix.', 'Will not rewrite commits')
    .addOption('ff', 'Will run merge with ff-only', 'Will run merge with no-ff')
    .addOption('squash', 'Will squash commits into 1', 'Will not squash commits into 1')
    .action(wrap(featureClose));

  program
    .command('release-create [commit] [tag]')
    .description('Creates a release from commit or master')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .addOption('close', 'Opens and closes the release creating a tag', 'Will not close the release')
    .addOption(
      'merge',
      'Will merge after creating tag if called with -c',
      'Will not merge after creating tag if called with -c'
    )
    .action(wrap(releaseCreate));

  program
    .command('release-close [tag]')
    .description('Close a release to master')
    .addOption('push', 'Pushes local changes to remote', 'Will not push local changes to remote')
    .addOption(
      'merge',
      'Will merge after creating tag if called with -c',
      'Will not merge after creating tag if called with -c'
    )
    .action(wrap(releaseClose));

  program
    .command('configure')
    .addOption('local', 'Configures local project')
    .description('Runs the initialize wizard')
    .action(wrap(initialize));

  taptapCommander.init(program, process.argv[1].split('/').pop());
  program.version(packageJson.version).parse(process.argv);

  if (program.args.length === 0) {
    program.help();
  }
}

init();
