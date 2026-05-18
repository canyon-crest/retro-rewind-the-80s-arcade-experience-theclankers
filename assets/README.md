# Assets

Overview
--------

The `assets/` directory contains images and client-side JavaScript modules used by the game. It groups visual resources and small, focused scripts that are imported by the main pages (for example `index.html`) and the example sketches in the `example/` folder.

Structure
---------

- **images**: static art, UI elements, and other image assets. See [assets/images](assets/images)
- **scripts**: game JavaScript modules used by the project. Common files include:
	- [assets/scripts/background.js](assets/scripts/background.js) — background rendering and parallax logic
	- [assets/scripts/camera.js](assets/scripts/camera.js) — camera / viewport handling
	- [assets/scripts/debug.js](assets/scripts/debug.js) — debug helpers and overlays
	- [assets/scripts/globalVar.js](assets/scripts/globalVar.js) — global constants and configuration
	- [assets/scripts/hitbox.js](assets/scripts/hitbox.js) — collision and hitbox utilities
	- [assets/scripts/player.js](assets/scripts/player.js) — player input, movement and state
	- [assets/scripts/scenes.js](assets/scripts/scenes.js) — scene and state management
	- [assets/scripts/sketch.js](assets/scripts/sketch.js) — main p5/sketch entrypoint that ties modules together

Usage
-----

- Reference scripts from `assets/scripts/` in your HTML (or import them from your bundler). The project's main page (`index.html`) loads these files directly during development.
- Store art and sprites in `assets/images/` and reference them by relative path from your HTML/JS.

Examples
--------

See the example usage in [example/index-example.html](example/index-example.html) and [example/sketch-example.js](example/sketch-example.js).

Notes
-----

- Keep scripts modular and avoid global side effects; prefer using exported functions or a single namespace where necessary.
- Update this README when adding, removing, or renaming assets so references remain accurate.
