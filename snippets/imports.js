const general = [
    `import React from 'react';`,
  
    `import {
    render as rtlRender,
    cleanup,
  } from '@testing-library/react';`,
  
    `import '@testing-library/jest-dom/extend-expect';`,
  
  ];
  
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
  import ${specName} from './${specName}';`,
    ];
  };
  
  module.exports = {
    general,
    intl,
    redux,
    getTestFile,
    getMessageFile,
  };
  