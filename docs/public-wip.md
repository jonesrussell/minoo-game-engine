# Ford Frenzy public WIP

Play [Ford Frenzy on Waaseyaa Labs](https://labs.waaseyaa.org/ford-frenzy/).
The directory is [labs.waaseyaa.org](https://labs.waaseyaa.org/).

This is the S01 newsroom preview by **jr42 productions**. Later scenes are not
playable yet. It includes search, embedded fictional source checks, the recorder
puzzle, closing dialogue and replay history. A clear WIP label and feedback link
surround the independently usable static game. Saves stay in the visitor's browser;
local-preview saves are not transferred to the public origin.

## Publication decision

On 2026-09-11 the owner explicitly authorized public WIP publication on the existing
Waaseyaa infrastructure. This is separate from final art/editorial acceptance,
#139 character acceptance, #140 pacing review, and the M4 alpha release in #19.
No Studio account, cloud development environment or runtime model service is required.
The standalone game and local development workflow remain unchanged.

## Published build

- Game source: `95084e2556111f8fe237349393aaeddc3e8e319d`.
- Public [build metadata](https://labs.waaseyaa.org/build.json).
- Hosting: an ARM64 nginx container behind the existing Cloudflare tunnel and Caddy.
- Infrastructure merge: `6d1406355239507f2df342649e2450afa1e518cd` in
  `jonesrussell/waaseyaa-infra`, PR #83, delivery issue #82.
- Retained image: `waaseyaa-labs:95084e2-wip1`, image identity
  `sha256:5006d8226c9dbfb8689d9e34786e313b5e5cd4199fb07830bcfcc4990d35a2e1`.

Hosting configuration, scoped DNS provisioning, artifact identity and rollback are
owned by the infrastructure repository (`runbooks/17-labs.md`, `deploy/labs.json`).
Updates publish a selected qualified artifact; merging game code does not automatically
replace the live preview. Rollback uses a retained image, not an assumed-identical rebuild.

## Executed verification

The public HTTPS URL passed desktop and phone browser checks for loading, attribution,
assignment completion, dialogue replay, saved progress after reload and reset. Metadata,
health and game artwork returned successfully; missing assets returned 404. Browser
checks recorded no page errors. All 37 served files matched between the tested AMD64
container and the deployed ARM64 image. Cloudflare readback and an idempotent second
provisioning run confirmed the Labs route. Existing Waaseyaa, Minoo and OIATC URLs
returned HTTP 200 after the Caddy change.

Report problems through the preview's Feedback link, including the browser/device,
build SHA and the step where the problem occurred. Track this publication under #151.
