const { l } = require('./line');

const customizeRtl = ({ intl }) => {
  const rtlRender = [
    l(`// Customize RTL Render`, 0, false),
    l(`function render(ui,`, 0, false),
    l(`{
    ${intl ? 'locale = \'en\',' : ''}
    ...renderOptions
  } = {}) {
  function Wrapper({ children }) {
    // @tdd-todo: Customize your render method.
    const messages = {};
    return (
      ${intl ? '<IntlProvider locale={locale} messages={messages}>' : ''}
        {children}
      ${intl ? '</IntlProvider>' : ''}
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });`, 2, false),
    l(`};`, 0),
  ];

  return rtlRender;
};

module.exports = {
  customizeRtl,
};
