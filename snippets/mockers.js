const { l } = require('./line');

const consumedComponentMock = ({ filePath }) => {
  return [
    `jest.mock(${filePath}, () => {`,
    l(`return jest.fn(() => null);`, 2, false),
    l(`});`, 0),
  ];
};

const promiseMethodMock = ({ filePath, importContext, resolveValue }) => {
  let returnValue = [
    l(`return new Promise(resolve => {
     // @tdd-todo: Add your Resolve value.
     resolve(${resolveValue});
    });`, 2, false),
  ];

  if (importContext.destruction.length > 0) {
    returnValue = [
      l(`return {`, 2, false),
      ...importContext.destruction.map(context => {
        return [
          l(`${context}: () => {`, 4, false),
          l('return new Promise(resolve => {', 6, false),
          l('// @tdd-todo: Add your Resolve value.', 8, false),
          l(`resolve(${resolveValue});`, 8, false),
          l('});', 6, false),
          l('},', 4, false),
        ].join('\n');
      }),
      l(`};`, 2, false),
    ];
  }

  return [
    `jest.mock(${filePath}, () => {`,
    ...returnValue,
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
