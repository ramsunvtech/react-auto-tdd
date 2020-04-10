const defineAfterEach = () => {
    const beforEach = [
      `afterEach(cleanup);`
    ];
  
    return beforEach;
  };
  
  module.exports = {
    defineAfterEach,
  };