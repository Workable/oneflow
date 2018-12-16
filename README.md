# one-flow

CLI tool to support Adam Ruka's branching model [oneflow](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow)

## Installing one-flow

1.  Run `npm install -g @workablehr/oneflow`

## Initialization

---

Before using `one-flow` a configuration wizard should be run in order to setup some basic settings. The result of this wizard is saved in `~/.oneflowrc` file. For project specific settings add and commit a `.oneflowrc` file in the root folder of your project.

The table below summarizes the supported settings:

| Setting                               | Usage                                                                                                              | Default |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| `BASE_BRANCH`                         | base branch to close features, hotfixes, releases                                                                  | master  |
| `MERGE_FF`                            | merge branches during feature-close using --ff-only?                                                               | true    |
| `FEATURE_CLOSE_REWRITE_COMMITS`       | Rewrite commits during feature-close to have as a prefix the feature-name                                          | true    |
| `RUN_CMD_AFTER_TAG_CREATION`          | Run a command after creating a tag                                                                                 |         |
| `CHANGE_VERSIONS_WHEN_TAGGING`        | Change versions when creating a tag (hotfix-close, release-close) currently supporting nodejs, java, ruby          | true    |
| `HOTFIX_CLOSE_REBASE_TO_LATEST_TAG`   | Rebase branch to latest tag during hotfix-close?                                                                   | true    |
| `PUSH_CHANGES_TO_REMOTE`              | Push changes to remote when possible?                                                                              | true    |
| `MERGE_INTERACTIVE`                   | Merge interactively during feature-close, hotfix-close?                                                            | false   |
| `FEATURE_CLOSE_SQUASH`                | Squash commits during feature close to one commit?                                                                 | false   |
| `RELEASE_CREATE_AND_CLOSE`            | Release create will also close it immediately updating versions and creating tags?                                 | false   |
| `RELEASE_CLOSE_MERGES_TO_BASE_BRANCH` | Release close will merge changes to base branch. Choose no if you want to merge manually (eg. to run tests first). | true    |
| `DEBUG`                               | Show debug information.                                                                                            | false   |

> To add autocomplete support use:
> `oneflow completion >> ~/.bashrc`

## Branching models and Workflow

---

### Feature branches

---

- To create a [feature branch](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow#feature-branches), use:

```
oneflow feature-create [options] [feature-name]
```

This command will create locally a feature branch from latest master.

Available options:

```
  -P, --no-push-flag  Will not push local changes to remote
  -h, --help          output usage information
```

- To close a feature branch, use:

```
oneflow feature-close [options] [feature-name]
```

This command will close the specified feature branch to master

Available options:

```
  -P, --no-push-flag  Will not push local changes to remote
  -i, --interactive   Interactive rebase
  -r, --rewrite       Will rewrite commit messages with feature as prefix.
  -f, --ff            Will run merge with ff-only
  -s, --squash        Will squash commits into 1
  -h, --help          output usage information
```

### Hotfix branches

---

- To create a [hotfix branch](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow#hotfix-branches), use:

```
oneflow hotfix-create [options] [hotfix-name] [base-tag]
```

This command will create locally a hotfix branch from the provided tag. `one-flow` will find and propose the latest tag if no other is provided.

Available options:

```
  -P, --no-push-flag  Will not push local changes to remote
  -h, --help          output usage information
```

- To close a hotfix branch use:

```
oneflow hotfix-close [options] [hotfix-name] [tag]
```

This command will close a hotfix branch to master creating a tag

Available options:

```
  -i, --interactive     Interactive rebase
  -R, --no-rebase-flag  Will not rebase to latest hotfix
  -P, --no-push-flag    Will not push local changes to remote
  -h, --help            output usage information
```

### Release branches

---

- To create a [release branch](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow#release-branches), use:

```
oneflow release-create [options] [commit] [tag]
```

This command will create a release branch from a specific commit or from master if no commit is provided

Available options:

```
  -P, --no-push-flag   Will not push local changes to remote
  -c, --close          Opens and closes the release creating a tag
  -M, --no-merge-flag  Will not merge after creating tag if called with -c
  -h, --help           output usage information
```

- To close a release branch use:

```
oneflow release-close [options] [tag]
```

This command will tag and merge a release branch to master

Available options:

```
  -P, --no-push-flag   Will not push local changes to remote
  -M, --no-merge-flag  Will not merge after creating tag if called with -c
  -h, --help           output usage information
```
