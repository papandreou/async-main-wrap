function exitWithError(err) {
  console.error(err);
  process.exit(1);
}

function asyncMainWrap(main) {
  return function() {
    if (typeof main !== "function") {
      return exitWithError(new Error("You must pass in a function."));
    }

    var promise = main.apply(null, arguments);

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
