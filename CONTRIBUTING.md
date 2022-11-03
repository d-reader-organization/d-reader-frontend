<h1 align="center">dReader contributing guide</h1>

> Conventions and steps to respect when contributing to the project

## Project structure

....

TODO

....

## Git

### Branching

- `master` is the production branch. CI/CD will reflect all changes on [dreader.io](https://www.dreader.io)

- ~~`staging` - [staging.dreader.io](https://staging.dreader.io)~~

- ~~`qa` - [qa.dreader.io](https://qa.dreader.io)~~

- `dev` - [dev.dreader.io](https://dev.dreader.io)

- `[chore | feat | fix | hotfix]/[task-name]` for active branches

e.g. `feat/candy-machine-integration` into `dev`, then `qa`, `staging`, and finally `master`

### Commits

Follow ['Conventional Commits'](https://www.conventionalcommits.org/en/v1.0.0/) guidelines

`feat: add candy-machine service`

`fix: local storage access token handling`

`chore: bump dependencies`
