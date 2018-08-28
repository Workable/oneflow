import exec, { revert, runRevert } from './exec';
import * as inquirer from 'inquirer';
import { branchName, confirm, tagName } from './questions';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as semver from 'semver';
import * as moment from 'moment';
import { getConfig, save } from './config';
const packageJson = require('../../package.json');

export async function hasVersionChanged() {
  if (
    !getConfig().GET_VERSION ||
    (!!getConfig().LAST_CHECKED && moment().isBefore(moment(getConfig().LAST_CHECKED).add(1, 'day')))
  ) {
    return;
  }
  const currentVersion = packageJson.version;
  const upstreamVersion = exec(getConfig().GET_VERSION, { log: false });
  if (semver.gt(upstreamVersion, currentVersion)) {
    console.log('New version exists...');
    if (await prompt(`Update to latest version ${upstreamVersion}`)) {
      exec('npm install -g @workablehr/oneflow', { interactive: true });
    }
  }
  save({ LAST_CHECKED: new Date().toISOString() });
}

function getCurrentCommit() {
  return exec('git log --pretty=format:"%H" -1', { log: false });
}

export function revertBranch(branch) {
  revert(`git checkout ${branch} && git reset --hard ${getCurrentCommit()}`);
}

export async function merge(
  from,
  to,
  { noff = false, enforceFF = true, rebase = false, rewriteCommits = false, interactive = false, squash = false } = {}
) {
  exec('git fetch origin --tags --prune');
  exec(`git checkout ${to}`);
  revertBranch(to);
  exec('git pull');
  exec(`git checkout ${from}`);
  revertBranch(from);
  exec('git pull', { exit: false });
  if (rebase) {
    revert('git reset --hard HEAD');
    revert('git rebase --abort');
    if (interactive || parseInt(exec(`git log --oneline ${to}..${from}|grep fixup|wc -l`), 10) > 0) {
      await exec(`git rebase -i ${to} --autosquash`, {
        interactive: true,
        exit: false,
        recover: recover('Rebase conflict exists. Please fix manually')
      });
    } else {
      await exec(`git rebase ${to}`, {
        exit: false,
        recover: recover('Rebase conflict exists. Please fix manually')
      });
    }
    if (rewriteCommits) {
      exec(`git filter-branch -f --msg-filter 'sed 1s/^${from}\\:\\ // | sed 1s/^/${from}\\:\\ /' ${to}..${from}`);
    }
  }

  if (squash) {
    const commit = exec(`git log --pretty=format:"%H" -1 ${from}`);
    const msg = `${from}\n\n${exec(`git log --oneline ${to}..${from}`)}`;
    exec(`git reset --hard ${to}`);
    exec(`git merge ${commit} --squash`);
    await exec(`git commit -m "${msg}"`);
  }

  exec(`git checkout ${to}`);
  revert('git reset --hard HEAD');

  await exec(`git merge ${from} ${noff ? '--no-ff' : enforceFF ? '--ff-only' : ''}`, {
    exit: false,
    recover: recover('Merge conflict exists. Please fix manually')
  });
}

export async function pushToRemote(shouldPush?, tags = false, setUpstreamBranch?) {
  if (shouldPush || (await prompt('Push changes to remote?'))) {
    exec(
      `git push ${setUpstreamBranch ? `--set-upstream origin ${setUpstreamBranch}` : ''} ${
        tags ? '&& git push --tags' : ''
      }`
    );
  }
}

export async function pushBranchToRemoteAndDelete(branch, shouldPush?) {
  if (shouldPush || (await prompt('Push changes to remote and delete branch?'))) {
    exec(`git push origin refs/heads/${branch}:refs/heads/${branch} --force-with-lease`); // push branch changes
    await exec(`git push --tags origin ${getConfig().BASE_BRANCH}`, {
      exit: false,
      recover: recover(
        'Could not push to remote.',
        "Press Y to retry or N to revert. Note that remote won't be reverted",
        true
      )
    });
    exec(`git branch -d ${branch} && git push origin :refs/heads/${branch}`);
    return true;
  } else {
    console.log(`Please run: ${chalk.red(
      `git push origin refs/heads/${branch}:refs/heads/${branch} --force-with-lease`
    )}
Please run: ${chalk.red(`git push --tags origin ${getConfig().BASE_BRANCH}`)}
Please run: ${chalk.red(`git branch -d ${branch} && git push origin :refs/heads/${branch}`)}`);
  }
}

export function getCurrentBranch() {
  return exec('git branch |grep \\* | sed s/*//g', { log: false });
}

export async function getBranchPrompt(branch, defaultName?) {
  if (!branch) {
    const currentBranch = await getCurrentBranch();
    ({ branchName: branch } = await inquirer.prompt(branchName(defaultName || currentBranch)));
  }
  return branch;
}

export async function getTagPrompt(tag, msg, nextRelease?) {
  if (!tag) {
    const latestTagCommit = exec('git rev-list --tags --max-count=1', { log: false });
    const latestTag = await exec(`git describe --tags ${latestTagCommit}`, { log: false });
    if (nextRelease) {
      tag = (latestTag && latestTag.startsWith('v') ? 'v' : '') + semver.inc(latestTag, nextRelease);
    } else {
      tag = latestTag;
    }
    ({ tagName: tag } = await inquirer.prompt(tagName(tag, msg)));
  }
  return (fs.existsSync('package.json') ? 'v' : '') + semver.valid(tag);
}

export function createTag(tag, branch) {
  revertBranch(branch);
  if (getConfig().CHANGE_VERSIONS_WHEN_TAGGING) {
    let commitMessage = tag;
    let versionBumped = false;
    if (fs.existsSync('package.json')) {
      exec(`npm version ${tag} --no-git-tag-version`);
      versionBumped = true;
    }
    if (fs.existsSync('VERSION')) {
      exec(`echo "${tag}" > VERSION`);
      versionBumped = true;
    }
    if (fs.existsSync('pom.xml')) {
      exec(`mvn versions:set -DgenerateBackupPoms=false -DnewVersion=${tag}`);
      const nextVersion = `${semver.inc(tag, 'minor')}-SNAPSHOT`;
      exec(
        `mvn versions:set -DgenerateBackupPoms=false -DnewVersion=${nextVersion}`
      );
      commitMessage = `prepare for next development iteration ${nextVersion}`;
      versionBumped = true;
    }

    if (versionBumped) {
      exec(`git commit -am "[oneflow] ${commitMessage}"`);
    }
  }
  exec(`git tag ${tag}`);
  revert(`git tag -d ${tag}`);
  getConfig().RUN_CMD_AFTER_TAG_CREATION &&
    exec(
      getConfig()
        .RUN_CMD_AFTER_TAG_CREATION.replace('${tag}', tag)
        .replace('${branch}', branch),
      { interactive: true }
    );
}

export async function prompt(msg): Promise<boolean> {
  return (await inquirer.prompt(confirm(msg))).confirm;
}

export function getReleaseName(tag) {
  return `release-${tag}`;
}

export function recover(msg, then = 'Then press y to continue', optionalRevert = false) {
  return async () => {
    if (await prompt(`${msg}\n ${then}`)) {
      console.log(chalk.magenta('continuing'));
    } else if (
      !optionalRevert ||
      prompt(`Revert local changes? This is not a good idea if changes are already pushed in remote.`)
    ) {
      runRevert();
      process.exit(1);
    } else {
      process.exit(1);
    }
  };
}
