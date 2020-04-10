const { l } = require('./line');

const consumedComponentMock = ({ filePath }) => {
  return [
    `jest.mock(${filePath}, () => {`,
    l(`return jest.fn(() => null);`, 2, false),
    l(`});`, 0),
  ];
};

const promiseMethodMock = ({ filePath, resolveValue }) => {
  return [
    `jest.mock(${filePath}, () => {`,
    l(`return () => {`, 2, false),
    l(`return new Promise(resolve => {
      // @tdd-todo: Add your Resolve value.
      resolve(${resolveValue});
    });`, 4, false),
    l(`};`, 2, false),
    l(`});`, 0),
  ];
};

const utilityMethodMock = ({ filePath }) => {
  return [
    `jest.mock(${filePath}, () => {`,
    l(`return jest.fn(() => null);`, 2, false),
    l(`});`, 0),
  ];
};

const hocComponentMock = ({ filePath }) => {
  return [
    `jest.mock(${filePath}, () => {`,
    l(`return (Component) => {`, 2, false),
    l(`return (props) => {
      return (
        <Component {...props} />
      );
    };`, 4, false),
    l('};', 2, false),
    l('});', 0),
  ];
};

module.exports = {
  consumedComponentMock,
  promiseMethodMock,
  utilityMethodMock,
  hocComponentMock,
};
