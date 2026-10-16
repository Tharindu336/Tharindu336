# Tharindu — Always building.

The profile README gives a glass-inspired preview and links to the interactive portfolio at https://tharindu-portfolio-rho.vercel.app/. GitHub controls the surrounding profile layout; the linked site provides the full custom interface and playable Snake game.

## Preview

Run `node scripts/preview.cjs`, then open http://127.0.0.1:8000/ to preview the interactive portfolio locally.

The GitHub Pages workflow deploys the static portfolio on pushes to `main`. Pages must first be enabled by a repository administrator: open **Settings → Pages**, select **GitHub Actions** as the build and deployment source, then rerun the **Deploy portfolio site** workflow. The workflow token cannot enable Pages for this repository.

## Upload the complete profile

Run `node scripts/package-profile.cjs` to create `artifacts/tharindu-profile-upload.zip`. Extract the archive and upload **its contents**, retaining the file and folder structure, into the `Tharindu336/Tharindu336` repository root. Upload the actual files, not the ZIP itself. The ZIP contains the README, artwork, local preview, data snapshot, generator, workflow, docs, licenses and tests; it excludes local logs and screenshots.

The README displays these generated SVG files directly:

- `profile-cover.svg`
- `profile-tech.svg`
- `profile-snake-still.svg`
- `profile-activity.svg`

GitHub profile pages keep GitHub's own layout and cannot run HTML, CSS, or JavaScript inside the README. The README displays generated artwork and an animated Snake preview; its portfolio link opens the interactive site.

## Visitor tracker

The shared profile-view badge in the README comes from [Komarev's profile-view counter](https://github.com/antonkomarev/github-profile-views-counter). It counts badge loads, not unique people or simultaneous online users. Refresh requests a new badge and may add a view; there is no automatic polling. Service availability and GitHub image caching affect updates.

The separate browser notebook counts page loads and seven-day history in local storage. Active time and interactions update for the current tab. Storage changes synchronize across tabs; restricted storage falls back to this visit. No browser notebook activity is sent to a server. Google Fonts and the badge are external requests.

## Tech meters and contribution data

The meters use actual language bytes in owned public repositories, excluding forks and Jupyter Notebook files. They show code distribution, not proficiency. Sort by share or alphabetically. The Full toolkit tab includes the original 18 tools and filters.

GitHub totals, streaks and the explorable calendar use `generated/profile-data.json` and `profile-data.js`, with their timestamp shown on the site. The calendar covers 365 days; longest streaks are limited to that window. Current streaks allow yesterday if today has no activity. Public data may omit private activity.

Refresh using Node 22+: `node scripts/generate-profile.cjs`. Without a token the generator uses public REST endpoints and the public GitHub calendar. With GITHUB_TOKEN it tries GraphQL first. Tokens are only used in headers, never saved or printed. A data fetch failure preserves the previous files. Use `node scripts/generate-profile.cjs --cached` to regenerate artwork without network requests.

The included Actions workflow refreshes the data and root artwork every six hours and supports manual runs after the files are uploaded and Actions is enabled. It uses the repository's built-in GITHUB_TOKEN; workflow write permissions must allow generated commits. Scheduled runs can be delayed. This is periodic data, not a live GitHub feed.

## Snake — The long game

Choose Let's play. Use arrows / WASD, swipe or directional buttons to steer. Space pauses; R restarts. Circuit mode includes fixed obstacles and two linked portals. Every third signal spawns a temporary shield or slow-time pickup. Shields rescue one collision if a safe turn exists. Slow time reduces movement speed. Consecutive meals within 35 ticks build combos up to ×5; every four meals increases speed. Classic removes the portals, obstacles and power drops.

The AI routes through the portal graph and around obstacles; when no food route exists it chooses the largest available region. It can lose and restarts automatically. Player bests are saved on the device; AI scores never replace them. Mode changes and Restart reset the run. Gameplay pauses offscreen, while the document is hidden, and during quick navigation. Reduce effects removes decorative motion while retaining gameplay.

The README GIF runs a deterministic preview of the same game rules, with a still SVG available for reduced-motion preferences. The interactive portfolio includes the playable Snake arena; GitHub README images cannot run game code.

## Checks

```sh
node --test --test-isolation=none tests/profile-data.test.cjs tests/snake.test.cjs tests/gif.test.cjs
node tests/verify-ui.cjs
node scripts/package-profile.cjs
```

Browser checks use installed Chrome or Edge through native DevTools, without npm dependencies. Set CHROME_PATH if needed. They verify responsive layouts, visitor persistence and fallback, meter sorting, toolkit tabs and filters, contribution keyboard navigation, Snake controls and animated README images. Screenshots are saved in `artifacts/`.

Tool icon licenses are preserved in [ICON-LICENSES.txt](ICON-LICENSES.txt).
