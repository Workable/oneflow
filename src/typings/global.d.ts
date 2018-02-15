declare namespace Mocha {
  interface ITestCallbackContext {
    commit(commmitMessage: string, file?: string): this;
    oneflow(arguments: string, input?: string): this;
    assertRemoteContainsBranch(branch: string): this;
    assertRemoteDoesNotContainBranch(branch: string): this;
    assertLocalContainsBranch(branch: string): this;
    assertLocalDoesNotContainBranch(branch: string): this;
    assertRemoteOnCommit(commit: string): this;
    assertLocalOnCommit(commit: string): this;
    assertLocalCommitMsg(msg: string, before?: number): this;
    assertLocalCommitMultiLineMsg(msg: string, before?: number): this;
    getCommit(branch?: string): { commitMsg: string; commit: string };
    checkout(branch: string): this;
    tag(tag: string): this;
  }
}
