# markdownlint-action

This action runs the command line tool [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli) on your markdown files and reports any errors into github annotations.

## Inputs

### `files`

**Required** The files to lint. Default `"**/*.md"`.

## Usage example

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Run markdownlint
        uses: betrybe/markdownlint-action
        with:
          files: '**/*.md'
```
