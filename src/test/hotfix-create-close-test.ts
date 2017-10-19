describe('hotfix-create hotfix-close', function() {
  it('should create hotfix from latest tag', function() {
    this.tag('1.0.0');
    const { commit, commitMsg } = this.getCommit();
    this.commit('going forward...')
      .commit('and forward')
      .oneflow('hotfix-create hotfix 1.0.0')
      .assertLocalCommitMsg(commitMsg)
      .assertLocalOnCommit(commit);
  });

  it('should create hotfix from latest tag and close it creating a new tag', function() {
    this.tag('2.0.0');
    this.commit('going forward...')
      .commit('and forward')
      .oneflow('hotfix-create hotfix2 2.0.0 -f')
      .commit('hotfix commit', 'file.txt');
    const { commit, commitMsg } = this.getCommit();

    this.oneflow('hotfix-close hotfix2 2.0.1 -f')
      .assertLocalCommitMsg("Merge branch 'hotfix2'")
      .checkout('2.0.1')
      .assertLocalOnCommit(commit)
      .assertLocalCommitMsg(commitMsg);
  });
});
