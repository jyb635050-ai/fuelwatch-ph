# 各种能源价格网站

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

## Official utilities and upgraded client (2026-10-05)

The client now has a fuel map, utility overview, and separate Water, Electricity, LPG and Natural gas views. It remains plain HTML/CSS/JavaScript, works via double-click, and uses no backend or build tool. Frosted glass surfaces, responsive panels, keyboard focus and reduced-motion support implement the requested visual direction. Brand search and cached GPU filtering avoid rebuilding and retransferring all 10,842 map points on brand changes. GitHub Pages has no user-controlled CPU to upgrade; these changes reduce client work instead.

Official collection uses `tools/fetch_utilities.py`. Each observation retains provider, area, tariff class, original date and clickable source. Current coverage is limited: Maynilad West Zone average basic charge, Meralco residential reference, and DOE NCR household 11 kg LPG survey. None is represented as an actual shop bill. The September electricity/LPG observations are explicitly historical. Natural-gas retail prices remain blank; LPG and LNG are never substituted. See BLOCKED.md.

Official sources:
- Maynilad dated FCDA notices: https://www.mayniladwater.com.ph/notice-to-maynilad-customers-foreign-currency-differential-adjustment-fcda-effective-october-1-2026/
- Meralco official rate PDF: https://meralcomain.s3.ap-southeast-1.amazonaws.com/2026-09/english_press_release-_meralco_september_2026_rates.pdf
- DOE NCR LPG index: https://doe.gov.ph/data-and-prices/lpg-monitor/ncr-lpg-prices
- DOE oil industry report (no verified natural-gas retail tariff): https://doe.gov.ph/oil-industry-management-bureau-s-year-end-comprehensive-report-fy2025

The cloud workflow `utility-monitor.yml` checks these sources daily at **04:35 Philippines time**, subject to GitHub scheduler delays. Check dates never replace price dates. Source failures retain previous observations with a visible failure state; dated snapshots are retained. This checks published references, not live meters or individual shop contracts. The existing fuel workflow keeps its weekly Tuesday/Wednesday schedule. Both workflows deploy the complete upgraded client and share a deployment lock.

Additional validation: `node tools/validate_utilities.mjs`; browser evidence is in `docs/upgrade-final-browser-results.json`. Frozen original acceptance remains unchanged.


## Brand (2026-10-05)
Presyo PH now names the fuel and utility reference tool. Presyo means price in Filipino. A blue rounded price tag with a peso symbol is used for the header and browser favicon. The repository and Pages URL are retained for existing visitors.


## Energy and network prices update (2026-10-05)
The user-specified title is now 各种能源价格网站. The empty natural-gas category is removed from current data and navigation; original historical snapshots remain factual archives.

Broadband and mobile data offers are separate views, grouped by the original billing period. Provider and billing-period filters, maximum speed/data allocation, collection date, source links and eligibility/contract/setup-cost notes accompany each offer. No daily/weekly offer is multiplied into an invented monthly tariff. Current collection covers 19 explicit offers from five supplier product pages: PLDT Home Internet, Globe GFiber Prepaid, Converge Super FiberX, Smart POWER ALL 99 and standard DITO Level-Up packs. This is a selection, not every supplier or offer. Supplier checkout/app/address confirmation remains necessary.

`tools/fetch_network.py` is part of the existing daily 04:35 Philippine-time cloud check and needs only Python standard library plus curl. Product pages without effective dates are recorded as observed, not newly effective tariffs. Parser/fetch failures retain original observed dates and show a failure status. `node tools/validate_network.mjs` validates sources, periods, parameters and dates. Both the weekly fuel and daily utility workflows include all network UI and data files when deploying. The original frozen acceptance is unchanged.


## 2026-10-06 多供应商官网调查

水务调查14家，9家取得数值；电力调查14家，11家取得数值（其中Negros Power只取得发电分项，Clark仅列部分收费组成且总价留空）。水务27条、电力41条类别/缺口记录；LPG11个DOE区域监测记录；网络7家31个套餐。上述是核验子集，不是全国完整费率库。

详情见 docs/research-water-20261006.md、docs/research-electricity-20261006.md、docs/research-coverage-20261006.md。UI可按供应商、服务地区、用户类别筛选，逐条链接原官方价目和披露其月份/无生效日期。住宅价不能代表商店或工程临时用电；最低月费不是每立方米单价；发电分项不是总电价，不进行跨地区虚假排名。

新增水电价表为2026-10-06人工官网核验，含2023/2024等原旧费表和八/九月电价，保留原日期，不宣称全是本月价格。原自动采集器每日检查Maynilad、Meralco、DOE和5家网络官网；SKY、TNT与Globe Go59本次人工核验后保留，尚无每日新价解析。采集失败不刷新旧价日期。tools/merge_researched_network.py 与 tools/build_provider_bundle.py 确保自动发布不丢失补充研究。

新增验证：node tools/validate_providers.mjs，node tools/validate_network.mjs；浏览器验证 tools/browser_providers.mjs。原 docs/acceptance.mjs 保持冻结。
