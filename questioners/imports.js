const inquirer = require('inquirer');

const askGeneralQuestion = ({
  onCustomizeRtlRender,
  onAddIntl,
  onAddStore,
  done,
}) => {
  inquirer
  .prompt([
    {
      type: 'confirm',
      name: 'canCustomizeRTLRender',
      message: 'Do you want to customize Render Method of `react-testing-library`?',
      default: true
    },
    {
      type: 'confirm',
      name: 'addIntl',
      message: 'Do you want to add Mock for IntlProvider',
      default: false
    },
    // {
    //   type: 'input',
    //   name: 'messageFilePath',
    //   message: 'Provide the Intl Messages File Path (provide it from Root) ?',
    //   default: '../../../../gebnglocalisation/web/en.json'
    // },
    {
      type: 'confirm',
      name: 'addStore',
      message: 'Do you want to add Mock for store',
      default: false
    }
  ])
  .then(answers => {
    // console.log('answers: ', answers);

    if(answers.canCustomizeRTLRender) {
      onCustomizeRtlRender();
    }

    if (answers.addIntl) {
      onAddIntl()
    }

    if (answers.addStore) {
      onAddStore();
    }

    done(answers.messageFilePath);
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });
}

const askForMocking = (importLine) => {
  return inquirer.prompt([
    {
      type: 'rawlist',
      name: 'importType',
      message: `Do you want to add Mock for below import ?\n${importLine}`,
      choices: [
        'Promise Model',
        'Utility Method',
        'Consumed Component',
        'HOC Component',
        'Skip'
      ]
    },
  ]);
};

module.exports = {
  askGeneralQuestion,
  askForMocking,
};
