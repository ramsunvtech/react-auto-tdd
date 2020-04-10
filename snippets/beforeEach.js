const { l } = require('./line');

const mockStore = [
  l(
    `const middlewares = [
      // Define your Middleware.
    ];
    const mockStore = configureMockStore(middlewares);
    store = mockStore({
      // @tdd-todo: Define Your Store Data which received in 'mapStateToProps'.
    });`, 4, false
  ),
];

const defineBeforeEach = ({ redux }) => {
  const beforEach = [
    l(`beforeEach(() => {`, 2, false)
  ];

  if (redux) {
    beforEach.push( ...mockStore );
  }

  return [
    ...beforEach,
    l(`});`, 2),
  ];
};

module.exports = {
  defineBeforeEach,
};