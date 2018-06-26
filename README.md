# Async main wrap

[![Build Status](https://travis-ci.com/gustavnikolaj/async-main-wrap.svg?branch=master)](https://travis-ci.com/gustavnikolaj/async-main-wrap)

A simple utility to base cli tools on async methods.

```js
// cli.js

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.argv);

// main.js

module.exports = async function cliTool(args) {
  if (!condition) {
    throw new Error("foo!"); // Will exit the CLI tool with status code 1.
  }

  console.log("All done!");
};
```

The motivation behind this tool is that I got tired of writing the same lines
to wrap my main method for small cli utilities.

Besides being small and simple, this tool also makes testing your cli tool a
lot simpler. You don't have to actually run it through the command line to test
it, you can simply test your main method.

The following rules apply for main methods:

- They should return a promise (or, you know, be an async function).
- They can throw, but they may never return anything.
- If they throw an error with a numeric exitCode property that will be used
  when shutting down the process.

The directory `lib/__fixtures__` contains some examples of different use, but
in general, most of it will look like the example at the top.

# Tips

## Pass in your output channels

No clever things is done around what arguments you're passed. Whatever you pass
to the wrapped method is passed on to your actual method. If you want to make
testing the output easier, you can pass the `console` object to your method.

```js
// cli.js

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.argv.slice(2), console);

// main.js

module.exports = async function cliTool(args, console) {
  const name = args[0] || world);

  console.log(`Hello, ${name}!`);
};

// main.spec.js

it('should say hello world', async () => {
  const logs = [];
  const mockConsole = { log(message) { logs.push(message); } };

  await main([], mockConsole);

  expect(logs, 'to equal', [ 'Hello, world!' ]);
});

it('should say hello Gustav', async () => {
  const logs = [];
  const mockConsole = { log(message) { logs.push(message); } };

  await main(['Gustav'], mockConsole);

  expect(logs, 'to equal', [ 'Hello, Gustav!' ]);
});
```

You could also pass in the raw `process.stdout` or `process.stderr` streams if
you want tighter control.

## Use with arguments parser

You can use any arguments parser you like, here I use yargs as an example:

```js
// cli.js

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.argv);

// main.js

const yargs = require("yargs");

module.exports = async function main(args) {
  const argv = yargs(args).argv;

  if (argv.help) {
    printHelp();
    return;
  }

  // ...

  console.log("Done!");
};
```

## Works with esm

The node "polyfill" for es modules: [esm](https://github.com/standard-things/esm)

```js
// cli.js

require = require("esm")(module);
const wrap = require("@gustavnikolaj/async-main-wrap");
const { default: main } = require("./esm-main");

wrap(main)(process.argv);

// main.js

export default async function main(args) {
  // ...
}
```

## Shebang (how to look like a real shell tool)

The `#!` line at the top of the file will tell the shell how to execute the
script, meaning that you no longer have to call the script with the `node`
binary.

```js
#!/usr/bin/env node

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.argv);
```

For this to work you need to give the script executable permissions. That can
be done like this on Linux and Mac:

```
$ chmod +x my-awesome-tool
```
