const exec = require('./build/lib/exec').default;
function createRepos() {
  exec('rm -rf example-repos');
  exec('mkdir example-repos');
  exec('cd example-repos && mkdir remote && cd remote && git init --bare');
  exec(
    'cd example-repos && mkdir local && cd local && git init && git remote add origin ../remote' +
      '&& echo "test">init.txt && git add . && git commit -m "initial commit" && git push --set-upstream origin master'
  );
}
const execLocal = cmd => exec(`cd example-repos/local && ${cmd}`);
const commit = (msg, file = 'init.txt') => execLocal(`echo '${msg}'>>${file} && git add . && git commit -m "${msg}"`);
const tag = tag => exec(`cd example-repos/local && git tag ${tag}`);
const fixup = (msg, file = 'init.txt') => execLocal(`echo '${msg}'>>${file} && git add . && git commit --fixup HEAD`);

function feature() {
  createRepos();
  execLocal('git checkout -b feature1');
  commit('commit 1');
  commit('commit 2');
  commit('commit 3');
  fixup('commit 3');
  commit('commit 4');
  fixup('commit 4');
}

async function hotfix() {
  createRepos();
  commit('commit 1');
  commit('commit 2');
  commit('commit 3');
  commit('commit 4');
  commit('commit 5');
  tag('1.0.0');
  await new Promise(r => setTimeout(r, 1000));
  execLocal('git push --tags origin master');
  commit('commit 6');
  commit('commit 7');
  commit('commit 8');
  commit('commit 9');
  commit('commit 10');
  tag('2.0.0');
  await new Promise(r => setTimeout(r, 1000));
  commit('commit 11');
  commit('commit 13');
  commit('commit 14');
  execLocal('git push --tags origin master');
}

async function release() {
  createRepos();
  commit('commit 1');
  commit('commit 2');
  commit('commit 3');
  commit('commit 4');
  commit('commit 5');
  tag('1.0.0');
  await new Promise(r => setTimeout(r, 1000));
  execLocal('git push --tags origin master');
  commit('commit 6');
  commit('commit 7');
  commit('commit 8');
  commit('commit 9');
  let c = execLocal(`git log --pretty=format:"%H" -4| tail -1`);
  execLocal(`git checkout -b release-1.1.0 ${c}`);
}

module.exports = {
  feature,
  hotfix,
  commit,
  release
  // release
};
