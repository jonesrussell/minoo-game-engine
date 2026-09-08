# S01 first playable checkpoint

Issue: #9. Related foundation slices: #8, #37, #97, #105 and #11.
Status: implemented for local review; later scene and release acceptance remains open.

## Outcome

New Game enters the Toronna Haps newsroom. Six approved proof sprites emit stable
selection actions through a public Pixi renderer adapter. The game-owned session
records finds, embedded clipping checks and recorder pairing before accepting a draft and
awarding K01 once. The result names S02 as unfinished. Journey remains a separate
working fixture; no Studio, account or model service is required.

## Requirements and evidence

- FF-UI-001/002: title, assignment, HUD, inspect, notebook, embedded clipping, recorder,
  submission, pause, settings, credits and result views. Keyboard focus stays in
  dialogs and returns to a stable play control.
- FF-INPUT-001: all six objects selectable by sprite pointer/touch or a freely
  movable keyboard search cursor. Resizing preserves logical bounds. Empty scene clicks
  do not create finds.
- FF-UI-003: all required textures load before a canvas is appended. An aborted
  required texture yields retry, which recovers with a single canvas.
- FF-SAVE-001, bounded S01: strict session journal restore gates Continue; corrupt
  save data survives until explicit New Game confirmation. Storage failure offers
  temporary play and explains that reload returns to the last saved point.
- FF-SCN-001, S01 fragment: wrong cable, rumour and an unread clipping cannot complete
  the assignment. Pointer, touch and keyboard flows reach K01. S02/S03 remain open.

`npm run test:ford` builds the production entry and starts its own ephemeral Vite
preview server. It checks full pointer/touch/keyboard completion, live resize,
wrong choices, embedded reading choices without external requests, save/reload, reset cancellation, required-asset retry,
single canvas, horizontal overflow and browser errors. The game skill's bundled
action client also exercises New Game and captures the scene/text state. Screenshots
are in `test-results/ford`; tested commit and full qualification belong in the PR.

## Limitations

This is a playable prototype using the approved seven-image proof. Objects use
rectangular texture bounds with an eight-logical-pixel border; exact alpha masks,
occlusion, production compression and puzzle balancing remain future work. The
recorder pairing uses visible text choices until connector art is delivered. The
browser adapter is a single active scene surface, not a multi-renderer shared-cache
service. Sound, campaign saves, S02/S03 transitions and final rights approval are
not claimed. Do not close broader parent issues solely from this slice.

Owner clarification (#128): source checking uses an original embedded Hogtown Howler clipping and a reading choice. Real-world references remain in development records; the game has no external source links.
