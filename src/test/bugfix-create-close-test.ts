describe('bugfix-create bugfix-close', function() {
  it('should create bugfix and push to remote', function() {
    this.oneflow('bugfix-create bugfix-branch -p')
      .assertLocalContainsBranch('* bugfix-branch')
      .assertRemoteContainsBranch('bugfix-branch');
  });

  it('should create bugfix change message and then close it', function() {
    this.oneflow('bugfix-create bugfix2-branch -p').commit('1st commit');
    const { commitMsg } = this.getCommit();
    this.assertLocalContainsBranch('* bugfix2-branch')
      .oneflow('bugfix-close bugfix2-branch -p -r')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('bugfix2-branch')
      .assertRemoteDoesNotContainBranch('bugfix2-branch');

    this.assertLocalCommitMsg(`bugfix2-branch: ${commitMsg}`);
  });

  it('should create bugfix and then close it', function() {
    this.oneflow('bugfix-create bugfix3-branch -p').commit('1st commit');
    const { commitMsg } = this.getCommit();
    this.assertLocalContainsBranch('* bugfix3-branch')
      .oneflow('bugfix-close bugfix3-branch -p -R')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('bugfix3-branch')
      .assertRemoteDoesNotContainBranch('bugfix3-branch');

    this.assertLocalCommitMsg(commitMsg);
  });

  it('should create bugfix and then close it with squash', function() {
    this.oneflow('bugfix-create bugfix4-branch -p').commit('1st commit');
    const { commit, commitMsg } = this.getCommit();
    this.commit('2ond commit');
    const { commit: commit2, commitMsg: commitMsg2 } = this.getCommit();

    this.assertLocalContainsBranch('* bugfix4-branch')
      .oneflow('bugfix-close bugfix4-branch -p -R -s')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('bugfix4-branch')
      .assertRemoteDoesNotContainBranch('bugfix4-branch');

    this.assertLocalCommitMultiLineMsg(
      `bugfix4-branch\n\n${commit2.substr(0, 7)} ${commitMsg2}\n${commit.substr(0, 7)} ${commitMsg}`
    );
  });

  it('should create bugfix and then close it with no-ff-flag', function() {
    this.oneflow('bugfix-create bugfix5-branch -p').commit('1st commit');
    const { commitMsg } = this.getCommit();
    this.assertLocalContainsBranch('* bugfix5-branch')
      .oneflow('bugfix-close bugfix5-branch -p -r -F')
      .assertLocalContainsBranch('* master')
      .assertLocalDoesNotContainBranch('bugfix5-branch')
      .assertRemoteDoesNotContainBranch('bugfix5-branch');

    this.assertLocalCommitMsg("Merge branch 'bugfix5-branch'");
    this.assertLocalCommitMsg(`bugfix5-branch: ${commitMsg}`, -1);
  });
});
