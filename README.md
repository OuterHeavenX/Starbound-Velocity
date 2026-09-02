# Starbound Velocity

A responsive vertical space shooter built with HTML5 Canvas, CSS, and vanilla JavaScript, with an optional Three.js layer (vendored locally, no build step) for true 3D rendering of the ship assembly bay and the Mother Base pilot.

## Play

Open `index.html` in a modern browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Controls

- `A` / `D` or `←` / `→` — strafe left and right
- `W` / `S` or `↑` / `↓` — micro-adjust the ship's vertical position
- Touch and drag horizontally — mobile steering
- `Space` or the mobile `FIRE` button — fire the laser cannon
- `Shift` — trigger the Afterburner upgrade (burst of speed + brief invulnerability), once unlocked
- `Escape` or the pause button — pause the current flight, then resume, restart the sector, or exit to Mother Base

## Gameplay

Destroy or avoid incoming asteroids as flight velocity increases. Asteroids take two laser hits, shatter into particles, and drop Scrap. Large asteroids split into two smaller fragments when destroyed instead of vanishing outright. Collect cyan energy orbs for 250 bonus points and 22 shield. Asteroid impacts, enemy fire, and boss attacks all drain shield; the run ends when the shield reaches zero. Your best distance and permanent ship upgrades are saved locally in the browser.

Past 500 distance, enemy fighters start dropping in, weaving side to side and firing aimed bolts at your position — they take laser hits like asteroids do and drop bonus Scrap on defeat. Glowing gold asteroids can release temporary Spread Shot, EMP Nova, or twin Drone Satellite power-ups. Chain kills within 1.5 seconds to build a combo multiplier, cross changing sectors every 2,500 distance, and destroy a bullet-hell Dreadnought every 5,000 distance for 250 Scrap.

Bosses also drop part-specific modular blueprints. The Shipyard's Visual Modular Assembly Bay installs Wings, Core Generator, Twin Cannons, and Armor Plates onto a live 3D-rendered hull (falls back to the 2D wireframe if WebGL/Three.js is unavailable); installed geometry and its speed, shield, weapon, or damage-reduction effects persist into gameplay. Ten permanent ship upgrades are purchasable with Scrap, including Hull Plating (stacking damage reduction), the Afterburner (an active dodge/invulnerability burst), and the Overcharge Core (permanent laser damage).

Each campaign sector is a named planet — Ferrous Wastes, Cryo Belt, Verdant Anomaly, Void Rift — cycling in that order, each yielding a distinct resource on every Dreadnought kill. Back at Earth Station (Mother Base), the Command Deck terminal lets you deposit collected resources into Cure Progress once the Research Lab is built; Earth's population, shown live in the Mother Base HUD, declines or recovers based on how that research is going. Five Mother Base expansions are purchasable in total, including the Research Lab and Deep Space Sensors (+50% resource yield).

## Architecture

- `index.html` — canvas, HUD, and game-state overlays
- `styles.css` — responsive neon flight-deck presentation
- `game.js` — render loop, input, spawning, collisions, particles, and state
- `three-scenes.js` — optional Three.js scenes (ship assembly bay, Mother Base pilot); no-ops cleanly if Three.js didn't load
- `vendor/` — vendored third-party libraries (Three.js, shadcn/Tailwind CSS), no CDN or build step required
- `README.md` — setup and gameplay documentation

## Browser support

Designed for current Chrome, Safari, Firefox, and Edge, including iPhone and iPad safe areas and pointer-based touch input.
