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
  
  module.exports = {
    isImport,
    isReact,
    isLocalImport,
    getImportPath,
  };
  