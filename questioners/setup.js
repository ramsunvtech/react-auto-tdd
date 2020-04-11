const inquirer = require('inquirer');

const askSetUpQuestion = ({
  done,
}) => {
  inquirer
  .prompt([
    {
      type: 'confirm',
      name: 'canSetup',
      message: 'Do you want to customize Render Method of `react-testing-library`?',
      default: false
    },
  ])
}

module.exports = {
  askGeneralQuestion,
  askForMocking,
};
