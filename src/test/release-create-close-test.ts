describe('release-create release-close', function() {
  it('creates release from master', function() {
    const { commit, commitMsg } = this.getCommit('master');
    this.oneflow('release-create master 3.0.0 -f')
      .assertLocalContainsBranch('* release-3.0.0')
      .assertLocalOnCommit(commit)
      .assertLocalCommitMsg(commitMsg)
      .assertRemoteContainsBranch('release-3.0.0');
  });

  it('creates release from master and closes it', function() {
    const { commit, commitMsg } = this.getCommit('master');
    this.oneflow('release-create master 4.0.0 -f')
      .oneflow('release-close 4.0.0 -f')
      .assertLocalOnCommit(commit)
      .assertLocalCommitMsg(commitMsg)
      .assertLocalDoesNotContainBranch('release-4.0.0')
      .assertRemoteDoesNotContainBranch('release-4.0.0');

    const { commit: commitOfTag } = this.getCommit('4.0.0');
    this.assertLocalOnCommit(commitOfTag).assertRemoteOnCommit(commitOfTag);
  });

  it('creates and closes release', function() {
    const { commit, commitMsg } = this.getCommit('master');
    this.oneflow('release-create master 5.0.0 -f -c')
      .assertLocalOnCommit(commit)
      .assertLocalCommitMsg(commitMsg)
      .assertRemoteContainsBranch('* master')
      .assertLocalDoesNotContainBranch('release-5.0.0')
      .assertRemoteDoesNotContainBranch('release-5.0.0');

    const { commit: commitOfTag } = this.getCommit('5.0.0');
    this.assertLocalOnCommit(commitOfTag).assertRemoteOnCommit(commitOfTag);
  });

  it('creates and closes release', function() {
    const { commit, commitMsg } = this.getCommit('master');
    this.oneflow('release-create master 6.0.0 -f -c -M')
      .assertLocalOnCommit(commit)
      .assertLocalCommitMsg(commitMsg)
      .assertLocalDoesNotContainBranch('* master')
      .assertLocalContainsBranch('release-6.0.0')
      .assertRemoteContainsBranch('release-6.0.0');
  });
});
