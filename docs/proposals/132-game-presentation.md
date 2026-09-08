# Ford Frenzy presentation checkpoint

Issue: #132. Owner feedback: the functional shell does not carry the approved GTA
IV-inspired Toronto crime-satire direction. This proposal changes presentation,
not simulation, source checking or save compatibility.

## Direction

The title uses the approved visual-direction-02 character composition unchanged,
overlaid with original editable Ford Frenzy lettering, rust/cream/ink colours,
“Welcome to Crack Nation” copy, a Toronto edition stamp and an unboxed game menu.
The production credit remains jr42 productions. Crack Nation is flavour copy,
not a replacement game title or a claim of a new logo asset.

The HUD uses condensed display lettering, a compact reporting-kit checklist and
stronger mission copy. Dialogue, notebook and the embedded clipping use paper and
ink treatment. Broadly shared navigation remains recognisable through existing
control IDs and focus paths; keyboard search continues to require spatial discovery.

## Asset and runtime boundary

`scripts/prepare-ford-assets.mjs` verifies the title source SHA-256
`0bf1e81cd1b91b4ac8ca229744e7308f4e5be365b72852cb80892c9364aad880`
before copying it to the local build. Approval and original generation records
remain in `docs/art/visual-direction-02`. No pixels were regenerated or edited.
Title imagery is decorative presentation; the actual scene remains Pixi-rendered.
There are no remote fonts, art requests or new runtime services. Impact is the
preferred system display font, with local fallbacks; exact font metrics vary by OS.

## Verification and remaining review

The production browser suite checks title image decoding, horizontal fit,
pointer/touch/keyboard completion, navigation, focus, save recovery and asset retry.
Screenshots cover title, gameplay and clipping on desktop and mobile sizes.
Tests establish working controls, not owner acceptance of the new visual treatment.
This remains a visual checkpoint using approved concept art, with final branding,
bespoke lettering, sound, final character production and release rights separate.
