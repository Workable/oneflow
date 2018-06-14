describe('feature-create feature-close', function() {
  it('should create feature and push to remote', function() {
    this.oneflow('feature-create test-branch -p')
      .assertLocalContainsBranch('* test-branch')
      .assertRemoteContainsBranch('test-branch');
  });

  it('should create feature change message and then close it', function() {
    this.oneflow('feature-create test2-branch -p').commit('1st commit');
    const { commitMsg } = this.getCommit();
    this.assertLocalContainsBranch('* test2-branch')
      .oneflow('feature-close test2-branch -p -r')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('test2-branch')
      .assertRemoteDoesNotContainBranch('test2-branch');

    this.assertLocalCommitMsg(`test2-branch: ${commitMsg}`);
  });

  it('should create feature and then close it', function() {
    this.oneflow('feature-create test3-branch -p').commit('1st commit');
    const { commitMsg } = this.getCommit();
    this.assertLocalContainsBranch('* test3-branch')
      .oneflow('feature-close test3-branch -p -R')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('test3-branch')
      .assertRemoteDoesNotContainBranch('test3-branch');

    this.assertLocalCommitMsg(commitMsg);
  });

  it('should create feature and then close it with squash', function() {
    this.oneflow('feature-create test4-branch -p').commit('1st commit');
    const { commit, commitMsg } = this.getCommit();
    this.commit('2ond commit');
    const { commit: commit2, commitMsg: commitMsg2 } = this.getCommit();

    this.assertLocalContainsBranch('* test4-branch')
      .oneflow('feature-close test4-branch -p -R -s')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('test4-branch')
      .assertRemoteDoesNotContainBranch('test4-branch');

    this.assertLocalCommitMultiLineMsg(
      `test4-branch\n\n${commit2.substr(0, 7)} ${commitMsg2}\n${commit.substr(0, 7)} ${commitMsg}`
    );
  });

  it('should create feature and then close it with no-ff-flag', function() {
    this.oneflow('feature-create test5-branch -p').commit('1st commit');
    const { commitMsg } = this.getCommit();
    this.assertLocalContainsBranch('* test5-branch')
      .oneflow('feature-close test5-branch -p -r -F')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('test5-branch')
      .assertRemoteDoesNotContainBranch('test5-branch');

    this.assertLocalCommitMsg("Merge branch 'test5-branch'");
    this.assertLocalCommitMsg(`test5-branch: ${commitMsg}`, -1);
  });
});
