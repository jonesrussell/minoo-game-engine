# Proposal 102: asset library to playable opening

Issue: #102. Status: specified; gameplay implementation pending.

## Why and scope

Ford Frenzy needs explicit contracts for importing existing art, deriving new art,
navigation, HUD, saves and scene transitions. The first-game brief alone does not
assign those screens or their failure behavior to delivery tasks.

The [experience spec](../specs/ford-frenzy-experience.md) defines FF-ART, FF-UI,
FF-INPUT, FF-SAVE, FF-SCN, FF-AUD and FF-QA requirements. The
[delivery plan](../ford-frenzy-delivery.md) maps them to native issues and milestones.
This change creates #103-#107 and updates existing task dependencies. It does not
import assets, generate images or implement gameplay. Those are the next deliveries.

## Verification

- Executed before submission: repository documentation/link checks; dependency
  acyclicity; native dependency readback for 17 affected issues; six new issues and
  their Phase/Readiness fields read back on both GitHub projects.
- Planned implementation evidence: requirement scenarios and test/review outputs
  at each implementing commit. Art and story approval remain explicit.
- The linked PR records its immutable source head and hosted qualification.

The standalone runtime and optional Studio boundary remain unchanged. Later full
campaign boards and final artwork do not block functional slice qualification.
