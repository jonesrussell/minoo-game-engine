# Proposal 96: replayable S01 newsroom session

Status: implemented as the S01-through-K01 checkpoint. S02 and cross-scene play
remain open work.

## Boundary

Ford Frenzy owns reporting meaning in `games/ford-frenzy/src/session.ts`. It imports
only the public Scene v2 and runtime APIs. The shared engine continues to count
finds, return duplicate events, bound hints and mark search completion; it does not
check reporting sources, interpret the recorder connector, accept a draft or award
K01.

The bundled `games/ford-frenzy/data/s01.json` is a version-2 scene with canonical
`S01.O1` through `S01.O6` object IDs, `S01.C1` through `S01.C6` content IDs and
the 1920 by 1080 positions from the approved pipeline proof manifest. C5 is an
attributed allegation linked to H01 and the existing ledger's May 16 Toronto Star
URL. Other content is original draft fiction; C3 is explicitly a fictional
date-context prop. Its rights status remains unresolved until clearance is actually
recorded. Source reference and reproduction rights remain separate metadata.

## Session API

`createNewsroomSession()` returns a headless session with `step(action)`,
`getState()`, `getActions()` and `exportSave()`. `restoreNewsroomSession(input)`
validates and replays an exported journal into a fresh session.

The controller accepts exact plain-object actions for selecting, hinting, checking a
found content record's source, choosing the recorder or phone connector, submitting
a published-report or office-rumour basis, and resetting scene or session scope.
Malformed and rejected actions do not enter the journal. Processed retry choices,
including the wrong phone connector and office-rumour submission, do enter it so
their feedback and later correction replay deterministically.

State snapshots expose finds, hints, search completion, checked content IDs, charger
choice, editorial acceptance, K01, the S02 unlock flag, notebook records and latest
UI feedback. Snapshots, nested records, events, action lists and saves are frozen
serializable copies.

## K01 gate and retries

Six unique finds mark only `searchCompleted`. K01 additionally requires the recorder
connector, a source check for `S01.C5`, and a `published-report` draft submission.
The successful step appends K01 once, marks editorial acceptance and changes the S02
transition from locked to unlocked. It does not create or enter an S02 session.
After K01, contradictory connector, draft-basis and new source-check choices are
rejected. Repeating the accepted connector, checked source or draft basis is
idempotent, so the completed state cannot disagree with its award.

A draft submitted before six finds is rejected without mutation. Once the search is
complete, a phone connector, office-rumour basis, missing connector or unchecked C5
returns editorial retry feedback while preserving finds, checked sources and the
three-hint budget. Repeating the corrected success path cannot duplicate K01.

## Reset and save

A scene reset before K01 clears engine finds, hints, source checks, connector choice
and editorial acceptance while retaining notebook discoveries. Scene reset is
rejected after K01 so an awarded scene cannot retain its award while silently
clearing its completed search. A session reset represents a confirmed New Game at
the controller boundary and clears all progression, including the notebook and K01.
The UI owns the confirmation prompt.

Save version 1 records an explicit S01 scene revision and the accepted action list.
Restoration rejects unknown fields, unsupported save or scene revisions, non-array
journals, more than 1,000 actions and the first action that cannot be replayed. No
partially restored session is returned. Persistence media and Continue availability
remain separate work.

## Verification scope

Unit coverage exercises the canonical data, find-versus-evidence boundary, source
gate, early and wrong connector choices, office-rumour retry, single K01 award,
duplicates, hint exhaustion, immutable snapshots, both reset scopes, exact replay,
corrupt saves and non-mutating invalid-action rejection. Browser UI, persistence,
S02/S03 and cross-scene replay remain outside this checkpoint.
