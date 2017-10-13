import * as homeConfig from 'home-config';
import initialize from './initialize';
const config = homeConfig.load('.oneflowrc');

if (!config.initialized) {
  initialize();
}

import * as program from 'commander';
import * as taptapCommander from 'commander-tabtab';
import hotfixCreate from './hotfix-create';
import hotfixClose from './hotfix-close';
import featureCreate from './feature-create';
import featureClose from './feature-close';
import releaseCreate from './release-create';
import releaseClose from './release-close';
const packageJson = require('../../package.json');

program
  .command('hotfix-create [branch] [from-tag]')
  .description('Create locally a hotfix branch from latest tag')
  .action(hotfixCreate);

program
  .command('hotfix-close [branch] [tag]')
  .description('Close a hotfix branch from latest tag to master creating a tag')
  .option('-f --force-push', 'Pushes local changes to remote')
  .action(hotfixClose);

program
  .command('feature-create [branch]')
  .description('Create locally a feature branch from latest master')
  .option('-f --force-push', 'Pushes local changes to remote')
  .action(featureCreate);

program
  .command('feature-close [branch]')
  .description('Close a feature branch to master')
  .option('-f --force-push', 'Pushes local changes to remote')
  .option('-i --interactive', 'Interactive rebase')
  .option('-r --rewrite', 'Will rewrite commit messages with feature as prefix.')
  .option('-n --no-ff', 'Will run merge with no-ff')
  .action(featureClose);

program
  .command('release-create [commit] [tag]')
  .description('Creates a release from commit or master')
  .option('-f --force-push', 'Pushes local changes to remote')
  .option('-c --close', 'Opens and closes the release creating a tag')
  .action(releaseCreate);

program
  .command('release-close [tag]')
  .description('Close a release to master')
  .option('-f --force-push', 'Pushes local changes to remote')
  .action(releaseClose);

program
  .command('configure')
  .description('Runs the initialize wizard')
  .action(initialize);

taptapCommander.init(program, packageJson.name);
program.version(packageJson.version).parse(process.argv);
