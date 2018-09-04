describe('helpers', function() {
  describe('createtag', function() {
    let commit;
    before(function() {
      ({ commit } = this.getCommit('master'));
      this.tag('0.0.1');
    });

    after(function() {
      this.checkout('master').local(`git reset --hard ${commit} && git push -f`);
    });

    it('test node, ruby, java version bump', function() {
      this.exec('cp ./src/test/fixtures/pom.xml ./example-repos/local')
        .exec('cp ./src/test/fixtures/package.json ./example-repos/local')
        .exec('cp ./src/test/fixtures/VERSION ./example-repos/local')
        .local('git add . && git commit -m "adding version files"')
        .oneflow('release-create master 1.1.0 -p')
        .oneflow('release-close 1.1.0 -p')
        .assertLocalCommitMsg('[oneflow] prepare for next development iteration 1.2.0-SNAPSHOT')
        .assertLocalCommitMsg('[oneflow] v1.1.0', -1);

      const { commit: commitOfTag } = this.getCommit('v1.1.0');
      this.checkout('v1.1.0').assertLocalOnCommit(commitOfTag);
      this.local('git tag -d v1.1.0 && git push origin :refs/tags/v1.1.0');
    });
  });
});
