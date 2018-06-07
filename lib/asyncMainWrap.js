function asyncMainWrap(main) {
  return function() {
    return main().then(
      value => {
        if (value) {
          const err = new Error(
            "You should not return anything from the wrapped method. Any return value will be ignored."
          );

          console.error(err);
          process.exit(1);
        }
      },
      err => {
        console.error(err);
        process.exit(1);
      }
    );
  };
}

module.exports = asyncMainWrap;
