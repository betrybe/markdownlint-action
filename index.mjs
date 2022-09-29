import fs from 'fs';
import * as github from '@actions/github';
import * as core from '@actions/core';
import markdownlint from 'markdownlint';

const { INPUT_TOKEN, INPUT_FILES } = process.env;
const FILES = INPUT_FILES.split(' ').filter((file) => file.endsWith('.md') && fs.existsSync(file));

const formatErrors = (errors, total) => {
  if (!total) return '#### Nenhum problema encontrado';

  const errorsArr = Object.entries(errors);

  const formattedErrors = errorsArr.reduce((fileAcc, [file, fileErrors]) => {
    if (fileErrors.length === 0) return fileAcc;

    const formattedFileErrors = fileErrors.reduce((
      errorAcc,
      {
        lineNumber, ruleDescription, ruleInformation, errorDetail,
      },
    ) => (
      `${errorAcc}- Linha \`${lineNumber}\`: ${ruleDescription}${errorDetail ? ` ${errorDetail}` : ''} - [Details](${ruleInformation})\n`
    ), '');

    return `${fileAcc}
#### Arquivo: \`${file}\`

${formattedFileErrors}`;
  }, '');

  return `<details>
<summary><strong>Total de erros: ${total}</strong></summary><br />
  ${formattedErrors}
</details>`;
};

const createComment = (errors, total) => {
  const octokit = github.getOctokit(INPUT_TOKEN);

  const comment = `
### Markdown lint
${formatErrors(errors, total)}
`;

  octokit.rest.issues.createComment({
    issue_number: github.context.payload.number,
    owner: github.context.payload.organization.login,
    repo: github.context.payload.repository.name,
    body: comment,
  });
};

const runLint = () => {
  console.log(`Running markdownlint into ${JSON.stringify(FILES)}`);

  const errors = markdownlint.sync({
    files: FILES,
  });

  const total = Object.values(errors).reduce((acc, errs) => acc + errs.length, 0);

  console.log(errors);

  createComment(errors, total);

  if (total) core.setFailed(`Found ${total} errors`);
  else console.log(`Found ${total} errors`);
};

runLint();
