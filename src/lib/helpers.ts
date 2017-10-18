import exec, { revert } from './exec';
import * as inquirer from 'inquirer';
import { branchName, confirm, tagName } from './questions';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as semver from 'semver';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');

function getCurrentCommit() {
  return exec('git log --pretty=format:"%H" -1', { log: false });
}

export function revertBranch(branch) {
  revert(`git checkout ${branch} && git reset --hard ${getCurrentCommit()}`);
}

export function merge(from, to, noff = config.NO_FF, rebase = false, rewriteCommits = false, interactive = false) {
  exec('git fetch origin --tags --prune');
  exec(`git checkout ${to}`);
  revertBranch(to);
  exec('git pull');
  exec(`git checkout ${from}`);
  revertBranch(from);
  exec('git pull', { exit: false });
  if (rebase) {
    if (rewriteCommits) {
      exec(`git filter-branch -f --msg-filter 'sed 1s/^${from}\\:\\ // | sed 1s/^/${from}\\:\\ /' ${to}..${from}`);
    }
    if (interactive || parseInt(exec(`git log --oneline ${to}..${from}|grep fixup|wc -l`), 10) > 0) {
      exec(`git rebase -i ${to} --autosquash`, { interactive: true });
    } else {
      exec(`git rebase ${to}`);
    }
  }
  exec(`git checkout ${to}`);
  exec(`git merge ${from} ${noff ? '--no-ff' : '--ff-only'}`);
}

export async function pushToRemote(shouldPush?, tags = false, setUpstreamBranch?) {
  if (shouldPush || (await prompt('Push changes to remote?'))) {
    exec(
      `git push ${setUpstreamBranch ? `--set-upstream origin ${setUpstreamBranch}` : ''} ${tags
        ? '&& git push --tags'
        : ''}`
    );
  }
}

export async function pushBranchToRemoteAndDelete(branch, shouldPush?) {
  if (shouldPush || (await prompt('Force push changes to remote?'))) {
    exec(`git push origin refs/heads/${branch}:refs/heads/${branch} -f`); // push branch changes
    exec(`git push --tags origin ${config.BASE_BRANCH}`);
    exec(`git branch -d ${branch} && git push origin :refs/heads/${branch}`);
    return true;
  } else {
    console.log(`Please run: ${chalk.red(`git push origin refs/heads/${branch}:refs/heads/${branch} -f`)}
Please run: ${chalk.red(`git push --tags origin ${config.BASE_BRANCH}`)}
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
      tag = (latestTag.startsWith('v') ? 'v' : '') + semver.inc(latestTag, nextRelease);
    } else {
      tag = latestTag;
    }
    ({ tagName: tag } = await inquirer.prompt(tagName(tag, msg)));
  }
  return (fs.existsSync('package.json') ? 'v' : '') + semver.valid(tag);
}

export function createTag(tag, branch) {
  revertBranch(branch);
  if (config.CHANGE_VERSIONS_WHEN_TAGGING && fs.existsSync('package.json')) {
    exec(`npm version ${tag}`);
  } else if (config.CHANGE_VERSIONS_WHEN_TAGGING && fs.existsSync('pom.xml')) {
    exec(
      `mvn release:prepare -DpushChanges=false -Dresume=false -DdevelopmentVersion=${semver.inc(
        tag,
        'minor'
      )}-SNAPSHOT -DreleaseVersion=${tag} -Dtag=${tag} -Darguments=-DskipTests --offline`,
      { interactive: true }
    );
  } else {
    exec(`git tag ${tag}`);
  }
  revert(`git tag -d ${tag}`);
  config.RUN_CMD_AFTER_TAG_CREATION &&
    exec(config.RUN_CMD_AFTER_TAG_CREATION.replace('${tag}', tag).replace('${branch}', branch), { interactive: true });
}

export async function prompt(msg) {
  return (await inquirer.prompt(confirm(msg))).confirm;
}

export function getReleaseName(tag) {
  return `release-${tag}`;
}
