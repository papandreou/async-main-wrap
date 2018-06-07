module.exports = async function() {
  const err = new Error("TEST_ERROR");
  err.exitCode = 42;

  throw err;
};
