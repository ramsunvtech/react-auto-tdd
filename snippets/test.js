const { l } = require('./line');

const defineTest = ({ specName, redux }) => {
  return [
  l(`test('match Snapshot', async () => {`, 2, false),
  l(`const { container } = render(<${specName} ${redux ? 'store={store}' : ''} />);`, 4, false),
  l(`expect(container).toMatchSnapshot();`, 4, false),
  l(`});`),
  ];
}

module.exports = {
  defineTest,
};