const path = require("path");
const { exec } = require("child_process");
const expect = require("unexpected");

function resolveFixture(name) {
  return path.resolve(__dirname, "../__fixtures__", `${name}/${name}`);
}

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    try {
      exec(cmd, (error, stdout, stderr) => {
        if (!error) {
          error = { code: 0 };
        }

        resolve({
          error,
          stdout,
          stderr
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}

it("should execute the method passed in", async () => {
  const fixture = resolveFixture("success");
  const result = await execAsync(fixture);

  expect(result, "to satisfy", {
    error: { code: 0 },
    stdout: "SUCCESS\n",
    stderr: ""
  });
});

it("should error and exit with status code 1", async () => {
  const fixture = resolveFixture("error");
  const result = await execAsync(fixture);

  expect(result, "to satisfy", {
    error: { code: 1 },
    stdout: "",
    stderr: /^Error: TEST_ERROR/
  });
});

it("should error out if the promise resolves with a value", async () => {
  const fixture = resolveFixture("returns");
  const result = await execAsync(fixture);

  expect(result, "to satisfy", {
    error: { code: 1 },
    stdout: "",
    stderr: /^Error: You should not resolve anything from the wrapped method./
  });
});

it("should error out if the method returns anything", async () => {
  const fixture = resolveFixture("nonPromise");
  const result = await execAsync(fixture);

  expect(result, "to satisfy", {
    error: { code: 1 },
    stdout: "",
    stderr: /^Error: The wrapped method must return a promise/
  });
});
