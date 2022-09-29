# markdownlint-action

This action runs [markdownlint](https://github.com/DavidAnson/markdownlint) on your markdown files and reports any errors into github annotations.

## Inputs

### `files`

**Required** The files to lint. Default `"**/*.md"`.
Can be used with another action to only lint files that have changed.

### `token`

**Required** The github token to use for annotations. Should be `${{ secrets.GITHUB_TOKEN }}`.

## Usage example

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  build:
    name: Validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Run markdownlint
        uses: betrybe/markdownlint-action
        with:
          files: '**/*.md'
          token: ${{ secrets.GITHUB_TOKEN }}
```
