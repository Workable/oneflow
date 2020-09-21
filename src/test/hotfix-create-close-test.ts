import * as assert from 'assert';
import * as sinon from 'sinon';

const sandbox = sinon.createSandbox();
describe('hotfix-create hotfix-close', function () {
  it('should create hotfix from latest tag', function () {
    this.tag('1.0.0');
    const { commit, commitMsg } = this.getCommit();
    this.commit('going forward...')
      .commit('and forward')
      .oneflow('hotfix-create hotfix 1.0.0 -p')
      .assertLocalCommitMsg(commitMsg)
      .assertLocalOnCommit(commit);
  });

  it('should create hotfix from latest tag and close it creating a new tag', function () {
    this.tag('2.0.0');
    this.commit('going forward...')
      .commit('and forward')
      .oneflow('hotfix-create hotfix2 2.0.0 -p')
      .commit('hotfix commit', 'file.txt');
    const { commit, commitMsg } = this.getCommit();

    this.oneflow('hotfix-close hotfix2 2.0.1 -p')
      .assertLocalCommitMsg("Merge branch 'refs/heads/hotfix2'")
      .checkout('2.0.1')
      .assertLocalOnCommit(commit)
      .assertLocalCommitMsg(commitMsg);
  });

  describe('if unstashed changes exist', function () {
    beforeEach(function () {
      sandbox.stub(process, 'exit').throws(new Error('error'));
    });

    afterEach(function () {
      sandbox.restore();
      this.local(`git reset --hard master`);
    });

    it('should throw an error and stop hotfix-close ', function () {
      this.tag('2.1.0');
      this.commit('going forward...').commit('and forward');
      const { commit } = this.getCommit();
      this.oneflow('hotfix-create hotfix3 2.1.0 -p').commit('hotfix commit', 'file.txt');

      this.local(`echo "{}">>package.json && git add package.json && git commit -m "Add package.json"`);
      this.local(`echo "{}">>init.txt`);

      assert.throws(() => this.oneflow('hotfix-close hotfix3 2.1.1 -p -R').assertLocalOnCommit(commit), {
        name: 'Error',
        message: 'error',
      });
    });
  });
});
