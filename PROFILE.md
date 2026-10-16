# Tharindu — Always building.

A complete redesign of the GitHub profile and its companion website. Yellow, black and warm white; new artwork, typography and layout throughout. The previous command deck, old SVG sections, project cards and ML activities have been removed.

## Preview

Run `node scripts/preview.cjs`, then open http://127.0.0.1:8000/ for the website. Run `node scripts/readme-preview.cjs` and visit http://127.0.0.1:8000/artifacts/readme-preview.html for a visual preview of the README artwork. The actual README is rendered by GitHub when uploaded.

## Upload the complete profile

Run `node scripts/package-profile.cjs` to create `artifacts/tharindu-profile-upload.zip`. Extract the archive and upload **its contents**, retaining the file and folder structure, into the `Tharindu336/Tharindu336` repository root. Upload the actual files, not the ZIP itself. The ZIP contains the README, artwork, website, data snapshot, generator, workflow, docs, licenses and tests; it excludes local logs and screenshots.

The README needs these **five files beside README.md**:

- `profile-cover.svg`
- `profile-tech.svg`
- `profile-snake.gif`
- `profile-snake-still.svg`
- `profile-activity.svg`

The screenshot of the old profile showed missing images. Pasting only the README cannot upload the images it references. All new references are validated during packaging and all artwork is checked in a browser. Local editing has not changed the live GitHub profile.

The playable website links target `https://tharindu336.github.io/Tharindu336/`. To serve the companion website there, enable GitHub Pages for this repository using the branch containing these files and the repository root as its source. GitHub README pages display images, links and the animated GIF; they cannot execute the game's JavaScript.

## Visitor tracker

The shared badge comes from [Komarev's profile-view counter](https://github.com/antonkomarev/github-profile-views-counter). It counts badge loads, not unique people or simultaneous online users. Refresh requests a new badge and may add a view; there is no automatic polling. Service availability and GitHub image caching affect updates. The website shows loading and error states.

The separate browser notebook counts page loads and seven-day history in local storage. Active time and interactions update for the current tab. Storage changes synchronize across tabs; restricted storage falls back to this visit. No browser notebook activity is sent to a server. Google Fonts and the badge are external requests.

## Tech meters and contribution data

The meters use actual language bytes in owned public repositories, excluding forks and Jupyter Notebook files. They show code distribution, not proficiency. Sort by share or alphabetically. The Full toolkit tab includes the original 18 tools and filters.

GitHub totals, streaks and the explorable calendar use `generated/profile-data.json` and `profile-data.js`, with their timestamp shown on the site. The calendar covers 365 days; longest streaks are limited to that window. Current streaks allow yesterday if today has no activity. Public data may omit private activity.

Refresh using Node 22+: `node scripts/generate-profile.cjs`. Without a token the generator uses public REST endpoints and the public GitHub calendar. With GITHUB_TOKEN it tries GraphQL first. Tokens are only used in headers, never saved or printed. A data fetch failure preserves the previous files. Use `node scripts/generate-profile.cjs --cached` to regenerate artwork without network requests.

The included Actions workflow refreshes the data and root artwork every six hours and supports manual runs after the files are uploaded and Actions is enabled. It uses the repository's built-in GITHUB_TOKEN; workflow write permissions must allow generated commits. Scheduled runs can be delayed. This is periodic data, not a live GitHub feed.

## Snake — The long game

Choose Let's play. Use arrows / WASD, swipe or directional buttons to steer. Space pauses; R restarts. Circuit mode includes fixed obstacles and two linked portals. Every third signal spawns a temporary shield or slow-time pickup. Shields rescue one collision if a safe turn exists. Slow time reduces movement speed. Consecutive meals within 35 ticks build combos up to ×5; every four meals increases speed. Classic removes the portals, obstacles and power drops.

The AI routes through the portal graph and around obstacles; when no food route exists it chooses the largest available region. It can lose and restarts automatically. Player bests are saved on the device; AI scores never replace them. Mode changes and Restart reset the run. Gameplay pauses offscreen, while the document is hidden, and during quick navigation. Reduce effects removes decorative motion while retaining gameplay.

The README GIF runs a deterministic simulation using the same rules. It is a looping preview, with a still SVG for reduced-motion preferences. Click through to the website to play.

## Checks

```sh
node --test --test-isolation=none tests/profile-data.test.cjs tests/snake.test.cjs tests/gif.test.cjs
node tests/verify-ui.cjs
node scripts/package-profile.cjs
```

Browser checks use installed Chrome or Edge through native DevTools, without npm dependencies. Set CHROME_PATH if needed. They verify responsive layouts, visitor persistence and fallback, meter sorting, toolkit tabs and filters, contribution keyboard navigation, Snake controls and animated README images. Screenshots are saved in `artifacts/`.

Tool icon licenses are preserved in [ICON-LICENSES.txt](ICON-LICENSES.txt).
