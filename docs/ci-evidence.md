# CI and downloadable evidence

Every pull request and main push runs `repository-check` and `runtime-check`.
The runtime job uses the pinned Node version, `npm ci`, Chromium installation,
unit tests, typecheck and a production build, then desktop keyboard and touch
browser checks. A console error, page error or failed assertion fails the job.

The Actions run provides two downloads, retained for 14 days:

- `browser-evidence-<tested-sha>-<attempt>` contains normal screenshots,
  `browser-results.json`, and failure screenshots/traces when a browser scenario
  fails. Setup failures may have only metadata and the Actions log.
- `journey-build-<tested-sha>-<attempt>` contains the standalone static build
  when the build step succeeded. A build artifact alone does not mean browser
  checks passed and does not authorize deployment.

Both include `evidence.json` with the actual checkout commit, PR source head,
run/attempt, Node version, dirty-tree flag and file hashes. On a PR, the tested
commit is normally GitHub's merge commit, not its source head. Read the run status
and browser report alongside these identities. Metadata is attempted even when
earlier steps fail; cancellation or runner failure may prevent upload.

Download artifacts from the PR's runtime check / Actions summary. Serve the
extracted build using a local static server. Open a failure trace locally with
`npx playwright show-trace <trace.zip>`. Tracing uses Playwright's library API,
so the trace contains browser activity; Node assertion details are in the JSON
report and job log. Sources: [Playwright tracing](https://playwright.dev/docs/api/class-tracing)
and [artifact uploads](https://github.com/actions/upload-artifact).

## Local verification

Run `npm ci`, `npm test`, `npm run test:e2e`, then
`node scripts/write-evidence.mjs`. Stop an existing local Vite server before
reinstalling dependencies on Windows to avoid native-module file locks.
The browser harness clears its known previous screenshots/traces on each run.

For the issue #3 failure probe, a temporary console error was appended to the
built JavaScript, then the browser harness was run directly. It exited 1,
reported the injected console error and saved a failure screenshot and a
nonempty trace ZIP. The original build bytes were restored. This validates the
failure path without placing test hooks into the game or weakening CI.

Require both named jobs in main's branch protection after the first successful
runtime job. Keep existing PR, linear-history and other protection settings.
This small fixture check does not prove full gameplay or cultural approval.
