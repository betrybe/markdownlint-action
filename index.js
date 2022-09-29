import * as github from '@actions/github';
import * as core from '@actions/core';
import { exec } from 'child_process';

const RULES_URL = 'https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md#';

const getLintErrors = (errors) => {
  const ERROR_REGEX = /(.+\.md):(.+) (MD\d+\/\S+) (.+)/gm;
  const errorsObj = { total: 0 };
  let foundError;
  while ((foundError = ERROR_REGEX.exec(errors)) !== null) {
    const [_match, file, line, rawRule, msg] = foundError;
    const rule = rawRule.replace(/MD(\d+)\/\S+/gm, 'md$1');
    errorsObj.total += 1;
    errorsObj[file] = errorsObj[file]
      ? [...errorsObj[file], { line, msg, rule }]
      : [{ line, msg, rule }];
  }
  return errorsObj;
};

const formatErrors = (errors) => {
  const errorsArr = Object.entries(errors);
  const [_, total] = errorsArr.shift();

  const formattedErrors = errorsArr.reduce((fileAcc, [file, fileErrors]) => {
    const acc = `${fileAcc}\n#### Arquivo: \`${file}\`\n\n`;

    const formattedFileErrors = fileErrors.reduce((errorAcc, { line, msg, rule }) => (
      `${errorAcc}- Linha \`${line}\`: ${msg} - [Details](${RULES_URL}${rule})\n`
    ), '');

    return `${acc}${formattedFileErrors}`;
  }, '');

  return `<details>
<summary><strong>Total de erros: ${total}</strong></summary><br />
  ${formattedErrors}
</details>`;
};

const runLint = () => {
  const changedFiles = process.env.INPUT_FILES;

  console.log(`Running 'npx markdownlint-cli ${changedFiles}'`);

  exec(`npx markdownlint-cli ${changedFiles}`, (_err, stdout, stderr) => {
    const errors = getLintErrors(stderr);

    console.log(stderr);
    console.log(stdout);

    const comment = `
### Markdown lint
${errors.total
    ? formatErrors(errors)
    : '#### Nenhum problema encontrado'}
`;

    github.rest.issues.createComment({
      issue_number: github.context.payload.number,
      owner: github.context.payload.organization.login,
      repo: github.context.payload.repository.name,
      body: comment,
    });

    if (errors.total) core.setFailed(`Found ${errors.total} errors`);
    else console.log('No errors found');
  });
};

runLint();
