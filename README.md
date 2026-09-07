# FuelWatch PH

A small, static Philippine fuel map. 10,842 OpenStreetMap stations, clustered for mobile performance. Open index.html directly while online, or visit GitHub Pages. No build tools, backend, account, API key or paid services.

## Price honesty

**参考价，非该站实测 — regional brand reference, NOT this station's measured pump price.** Prices are PHP/litre. data/prices.json contains 19 published Metro Manila (NCR) brand-average entries for the week beginning 2026-09-01, retrieved 2026-09-07 from https://gaswatchph.com/. Source HTML and readable evidence are in docs/. Nine brands have diesel and RON91; only Shell has verified RON95 here. Jetti/Cleanfuel were conservatively excluded because their published values exactly equal overall averages. No reference is imputed from another brand.

Only explicit, unambiguous NCR city address tags receive NCR prices. Unknown/missing city tags and all other regions stay grey. This intentionally sacrifices coverage to avoid applying Manila prices nationwide. The city-label list is conservative, not a verified administrative boundary. Fuel availability and station operation are not verified. OSM is not a complete national census.

Weekly changes in the header are selected retailer announcements, not the difference between our brand averages: https://www.gmanetwork.com/news/money/economy/1000521/pump-price-rollback-set-tuesday-september-1-2026/story/ . They apply to the displayed Sep 1 week. After seven days, map price assignment stops and the snapshot is marked archived. Brand cards remain explicitly archived references. Never drive based on an unconfirmed pump price.

## Map and interaction

MapLibre GL 5.6.2 CDN; OpenFreeMap Liberty style. All 10,842 stations are loaded into a GeoJSON clustered source, never individual DOM markers. Cluster numbers count stations, not prices. Zoom to individual points; select brands and diesel/RON91/RON95. Nearby compares known reference prices within 15 km straight-line, respecting filters, and never promises to find the actual cheapest pump. Location stays in the browser.

## Sources and attribution

Stations: OpenStreetMap contributors, https://www.openstreetmap.org/copyright , ODbL. Raw query evidence docs/overpass-curl.json, counts verified at 2026-09-07T03:54:36Z. Query: Philippine ISO3166-1 area, nwr[amenity=fuel], way/relation centers. A center may not be the entrance. Display station fields: id/lat/lon/brand/name/city only. Normalization audit: docs/brand-normalization.json. Tail brands not in the 39 canonical display brands are Unknown, with original tags retained in evidence. Source license applies to station data and derivatives.

Map tiles: OpenFreeMap, OpenMapTiles and OpenStreetMap contributors. Basemap/CDN require internet and WebGL even for a double-click local launch.

## History and updates

One actual collected weekly snapshot in data/history.json, reconstructed:false, collected_at:2026-09-07. No fictitious historical curves. UI draws mini trends only when at least two genuine weekly entries exist. The first week is 2026-09-01. Future price updates require checking the effective week, regional scope, product grade and source, then retaining each week's snapshot. No unattended price update is configured; a weekly date warning prevents old data being represented as current. See BLOCKED.md for remaining gaps.

## Verification

Run from this directory:

    node docs/acceptance.mjs stations
    node docs/acceptance.mjs prices
    node docs/acceptance.mjs page
    node docs/acceptance.mjs all

Frozen acceptance SHA256: CABD0D72A74F79132C7A4D537595D0CF31447407ED0FE92188203969551A90A9

Negative test: node docs/acceptance.mjs prices docs/negative-prices.json must exit 1 (first source_url deliberately blank). The production file is never damaged. The tests validate shape/recency and key UI obligations; human source and browser checks are additional evidence, not implied by a green script. Recency tests deliberately fail once data is over 21 days old.

PROGRESS.md records completed work. BLOCKED.md records limitations and deviations. Failed fetch implementation is retained under the no-overwrite rule; curl evidence and tools/process_stations.mjs successfully produced the stations.

Public source excerpt: docs/source-evidence.md. Full HTML/text evidence is local-only. Delivered screenshots use the *-verified.png filenames after waiting for actual rendered station features.

Final renderer clarification: the installed MapLibre clustering path failed to draw clusters in browser verification. Clustering is therefore restricted to zoom 0 (outside the app's zoom range); all visible levels use GPU/WebGL circle layers, which the brief explicitly permits. Actual rendered-feature verification counts 10,842 nationwide points. There are no individual DOM markers. Cluster-count language in earlier notes describes the initial implementation, not the final visible rendering.

The final clusterMaxZoom is 1 (the library treats zero as a default). This remains below minZoom=3, so visible rendering is entirely WebGL circles.

## Weekly automation (added 2026-09-07)

GitHub Actions workflow `.github/workflows/weekly-prices.yml` runs in the cloud every Tuesday and Wednesday at **10:17 and 18:17 Philippines time (UTC+8)**. Wednesday and evening runs catch late publication. GitHub can delay scheduled runs; these are intended start times. The computer does not need to remain on. The workflow also supports Run workflow on the Actions page.

`tools/update_weekly.mjs` checks the source's dated Metro Manila snapshot against the current Philippine Tuesday-based week, cross-checks the table date, requires at least 15 verified rows, and refuses stale, ambiguous or incomplete source data. Repeated runs in the same week do not replace the already recorded snapshot. A new week preserves all history, creates an immutable `data/snapshots/YYYY-MM-DD.json`, updates prices and the double-click bundle, runs the frozen acceptance and publishes Pages. Local backups are excluded from Git; previous production data also remains in Git history. No deployment happens if fetch, parsing, tests or acceptance fail.

The parser currently supports the 9-brand diesel/RON91 public table (18 rows). It does not infer RON95; unsupported grades disappear from the new week's table rather than carrying forward old data. Existing launch-week Shell RON95 remains in that week's historical snapshot. The homepage change panel now compares matching brand/region/fuel references from adjacent weeks, not hard-coded launch-week announcements. History stays factual.

Manual check: `node tools/update_weekly.mjs --check`. Manual update: `node tools/update_weekly.mjs`, followed by acceptance and commit/push; cloud workflow performs these automatically and deploys directly. Regression tests: `node tools/test_weekly_verified.mjs`.

Earlier statements that automation was unconfigured describe the initial delivery and are superseded by this section. Price coverage remains NCR-only. Source format/date changes intentionally block an update for review, never invent replacement values.
