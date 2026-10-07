# 2026-10-07 移除价格总览

移除导航按钮、总览卡片生成及依赖；水、电、LPG、宽带、电信和油价地图直接切换。备份work/remove-overview-oct07。既有数据不删除，冻结验收不改。

实际输出：
```
node docs/acceptance.mjs all
PASS stations: total=10842 >=10500; missing_coordinates=0; brands=40 <=40; no case variants
PASS prices: rows=18 >=15; source_url=http; as_of=2026-10-06 within 21 days; duplicates=0 (data/prices.json)
PASS page: openfreemap; clustered stations; no Marker; 非该站实测; dated history
curl.exe -sI https://jyb635050-ai.github.io/fuelwatch-ph/
HTTP/1.1 200 OK
node tools/browser_no_overview.mjs --online
PASS direct categories {"overviewTab":0,"overviewCards":0,"navTabs":6,"categoryRows":{"water":27,"electricity":41,"lpg":11,"broadband":19,"mobile":12},"providerFilters":true,"returnedMapStations":10842,"mobileOverflow":false,"errors":[]}
```

云端run37555539247 success，实际完整日志no-overview-deploy-37555539247.txt。本地和线上水务/地图/手机截图已保存，已查看本地导航与地图截图。冻结SHA256 CABD0D72A74F79132C7A4D537595D0CF31447407ED0FE92188203969551A90A9。原数据缺口保留在BLOCKED.md，本项无新增未解决问题。
