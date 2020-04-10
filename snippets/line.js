const l = ( code, noOfSpace = 2, addEmptyLine = true ) => {
    return `${' '.repeat(noOfSpace)}${code}${addEmptyLine ? '\n' : ''}`;
  };
  
  module.exports = {
    l,
  }