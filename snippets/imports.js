const getGeneralImport = ({ rtlRender }) => {
  const general = [
  `import React from 'react';`,
  `import {
  ${rtlRender ? 'render as rtlRender' : 'render'},
  cleanup,
} from '@testing-library/react';`,
  `import '@testing-library/jest-dom/extend-expect';`,
  ];

  return general;
};

const intl = [
  `import { IntlProvider } from 'react-intl';`,
];

const getMessageFile = (filePath) => {
  return [
    `
  // Intl Message File.
  import intlMessages from '${filePath}';
      `,
  ];
};

const redux = [
  `import configureMockStore from 'redux-mock-store';`,
];

const getTestFile = (specName) => {
  return [
    `
// Components Imports.
import ${specName} from './${specName}';
`,
  ];
};

module.exports = {
  getGeneralImport,
  intl,
  redux,
  getTestFile,
  getMessageFile,
};
