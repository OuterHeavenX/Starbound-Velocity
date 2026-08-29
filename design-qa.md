# Mother Base Expansion — Design QA

- Source visual truth: `qa-evidence/reference-current-base.jpeg`
- Browser-rendered implementation: `qa-evidence/implementation-mother-base.jpg`
- Reference pixels: 709 × 1536, mobile portrait, density metadata 72 dpi
- Implementation pixels: 1363 × 936, desktop cloud-browser viewport, device scale factor 1
- State: Mother Base immediately after entry, astronaut in the central transit hall
- Intended comparison: structural correction, not a one-to-one clone. The reference is the rejected single-screen layout; the implementation must preserve its neon wireframe language while becoming a multi-screen scrolling world.

## Full-view comparison evidence

The source places Hangar, Command, Hydro-Lab, beds, player, and parked ship inside one viewport-sized rectangle. The implementation visibly crops a much larger world through a following camera: portions of the Hangar, Crew Quarters, Hydro-Lab, central junction, room doors, and connecting corridors extend beyond the current viewport. This resolves the primary scale and spatial-navigation mismatch.

## Focused-region evidence

- Ship synchronization was checked in the browser in the Hangar / Blueprints tab and in the expanded Hangar room. Both now call the shared `drawModularShip` renderer with the current hull, skin, and installed-part state. The previous Mother Base diamond placeholder is removed.
- Hallway and room boundaries were checked at the central junction. The astronaut is rendered at world coordinates while the camera follows independently, confirming this is a navigable world rather than a scaled floor-plan image.
- The Hydro-Lab preserves the reference's green wireframe visual identity while expanding each crop into its own room-scale grow bed.

## Required fidelity surfaces

- Fonts and typography: Orbitron and Chakra Petch remain consistent with the existing interface. Room names are larger and readable at world scale; secondary deck labels remain subordinate.
- Spacing and layout rhythm: rooms are now hundreds of world pixels wide, separated by a central cross-hallway and framed door thresholds. Fixed HUD elements remain distinct from world geometry.
- Colors and visual tokens: cyan transit, violet Hangar, green Hydro-Lab, and blue Crew Quarters retain the established neon-on-black palette.
- Image and asset fidelity: the game is intentionally Canvas-vector rendered. No new raster placeholder replaces the ship or station. The same runtime ship renderer is reused across flight, Assembly Bay, and Hangar.
- Copy and content: existing campaign, seed-vault, and farming language is preserved; the fourth room is clearly labeled `CREW QUARTERS`.

## Primary interactions tested

- Enter Mother Base from the title screen.
- Confirm the expanded station world renders without game-script console errors.
- Open Upgrades and switch to Hangar / Blueprints.
- Confirm the Assembly Bay renders the shared modular hull geometry.
- Confirm fixed campaign and seed HUD remains available over the station state.

Browser console check: no `game.js` errors. Two browser-extension metadata errors were observed and are unrelated to the application.

## Findings

No actionable P0, P1, or P2 issues remain for the requested correction.

## Comparison history

- Earlier P1: Mother Base was a single-screen floor plan. Fixed with an 1880 × 1540 scrolling world, camera follow, four large rooms, cross-hallways, and door frames.
- Earlier P1: Mother Base used a separate diamond ship approximation. Fixed by rendering the current ship through `drawModularShip`, the same geometry used by active gameplay and the Assembly Bay.
- Post-fix evidence: `qa-evidence/implementation-mother-base.jpg` and the browser-tested Hangar / Blueprints state.

## Follow-up polish

- P3: Add ambient station NPCs or animated service drones in a later pass if Mother Base needs more life.

final result: passed
