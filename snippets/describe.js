const { defineBeforeEach } = require('./beforeEach');
const { defineTest } = require('./test');
const { l } = require('./line');

const defineDescribe = ({ specName, redux }) => {
  return [
  `describe('${specName}', () => {`,
    ...(redux ? [ l('let store;') ] : []),
    ...defineBeforeEach({ redux }),
    l(`afterEach(cleanup);`),
    ...defineTest({ specName, redux }),
  `});`,
  ];
};

module.exports = {
  defineDescribe,
};