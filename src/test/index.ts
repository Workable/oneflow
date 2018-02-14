import { install } from 'source-map-support';
install();
import * as path from 'path';
import * as tsConfigPaths from 'tsconfig-paths';
import 'should';

const tsConfig = require('../../tsconfig.json');
const baseUrl = path.resolve(tsConfig.compilerOptions.outDir);
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});

import exec from 'exec';

function createRepos() {
  exec('rm -rf example-repos');
  exec('mkdir example-repos');
  exec('cd example-repos && mkdir remote && cd remote && git init --bare');
  exec(
    'cd example-repos && mkdir local && cd local && git init && git remote add origin ../remote' +
      '&& echo "test">init.txt && git add . && git commit -m "initial commit" && git push --set-upstream origin master'
  );
}

createRepos();

before(function() {
  this.runLocal = cmd => {
    return exec(`cd example-repos/local && ${cmd}`);
  };

  this.runRemote = cmd => {
    return exec(`cd example-repos/remote && ${cmd}`);
  };

  this.local = cmd => {
    this.runLocal(cmd);
    return this;
  };

  this.assertLocal = (cmd, equal, msg?) => {
    this.runLocal(cmd).should.equal(equal, msg);
    return this;
  };

  this.assertRemote = (cmd, equal, msg?) => {
    this.runRemote(cmd).should.equal(equal, msg);
    return this;
  };

  this.commit = (msg, file = 'init.txt') => this.local(`echo ${msg}>>${file} && git add . && git commit -m "${msg}"`);

  this.getCommit = (branch = '') => ({
    commit: this.runLocal(`git log --pretty=format:"%H" -1 ${branch}`),
    commitMsg: this.runLocal(`git log --pretty=format:"%s" -1 ${branch}`)
  });

  this.oneflow = params => this.local(`./../../bin/oneflow ${params}`);

  this.assertRemoteContainsBranch = branch =>
    this.assertRemote(`git branch -a | grep "${branch}"| wc -l`, '1', `remote does not contain branch ${branch}`);

  this.assertRemoteOnCommit = commit =>
    this.assertRemote(`git log --pretty=format:"%H" -1`, commit, `remote is not on commit ${commit}`);

  this.assertLocalOnCommit = commit =>
    this.assertLocal(`git log --pretty=format:"%H" -1`, commit, `local is not on commit ${commit}`);

  this.assertRemoteDoesNotContainBranch = branch =>
    this.assertRemote(`git branch -a | grep "${branch}"| wc -l`, '0', `remote still contains branch ${branch}`);

  this.assertLocalContainsBranch = branch =>
    this.assertLocal(`git branch | grep "${branch}"| wc -l`, '1', `local does not contain branch ${branch}`);

  this.assertLocalDoesNotContainBranch = branch =>
    this.assertLocal(`git branch | grep "${branch}"| wc -l`, '0', `local still contains branch ${branch}`);

  this.assertLocalCommitMsg = (msg, num = 0) =>
    this.assertLocal(`git log --pretty=format:"%s" ${num - 1} | tail -1`, msg, `commit msg does not match with ${msg}`);

  this.assertLocalCommitMultiLineMsg = (msg, num = 0) =>
    this.assertLocal(`git log --pretty=format:"%B" ${num - 1} `, msg, `commit msg does not match with ${msg}`);

  this.checkout = branch => this.local(`git checkout ${branch}`);
  this.tag = tag => this.local(`git tag ${tag}`);
});
