const isImport = line => {
  return (line || '').startsWith('import ');
};

const isReact = line => {
  return isImport(line) && (line || '').endsWith(" 'react';");
};

const isLocalImport = line => {
  return isImport(line) && (line || '').indexOf('./') > -1;
};

const getImportPath = (importStatement = '') => {
  const splitList = importStatement.split(' from ');
  const importFileName = splitList[1].replace(';', '');
  return importFileName;
};

const getImportContext = (importLine) => {
  const regex = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
  const matchedContext = regex.exec(importLine);
  const context = {
    default: '',
    destruction: '',
  };

  if (Array.isArray(matchedContext) && !!matchedContext[1]) {
    const importContext = matchedContext[1].split('{');

    if (!!importContext[0]) {
      context.default = importContext[0].replace(',', '').trim();
    }

    if (!!importContext[1]) {
      const destructRegex = /{\s*([^}]+)}/g.exec(matchedContext[0]);

      if (!!destructRegex[1]) {
        context.destruction = destructRegex[1].trim().split(',').map(item => item.trim());
      }
    }
  }

  return context;
};

module.exports = {
  isImport,
  isReact,
  isLocalImport,
  getImportPath,
  getImportContext,
};
