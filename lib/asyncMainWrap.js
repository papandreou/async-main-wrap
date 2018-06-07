function exitWithError(err) {
  console.error(err);
  process.exit(1);
}

function asyncMainWrap(main) {
  return function() {
    var promise = main();

    if (!promise || typeof promise.then !== "function") {
      var err = new Error("The wrapped method must return a promise.");
      return exitWithError(err);
    }

    return promise.then(
      value => {
        if (value) {
          const err = new Error(
            "You should not resolve anything from the wrapped method. Any return value will be ignored."
          );

          exitWithError(err);
        }
      },
      err => exitWithError(err)
    );
  };
}

module.exports = asyncMainWrap;
