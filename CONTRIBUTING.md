<h1 align="center">dReader contributing guide</h1>

> Conventions and steps to respect when contributing to the project

## Project structure

....

TODO

....

## Git

### Branching

- `master` is the production branch. CI/CD will reflect all changes on [dreader.app](https://www.dreader.app)

- ~~`staging` - [staging.dreader.app](https://staging.dreader.app)~~

- ~~`qa` - [qa.dreader.app](https://qa.dreader.app)~~

- `dev` - [dev.dreader.app](https://dev.dreader.app)

- `[chore | feat | fix | hotfix]/[task-name]` for active branches

e.g. `feat/candy-machine-integration` into `dev`, then `qa`, `staging`, and finally `master`

### Commits

Follow ['Conventional Commits'](https://www.conventionalcommits.org/en/v1.0.0/) guidelines

`feat: add candy-machine service`

`fix: local storage access token handling`

`chore: bump dependencies`
