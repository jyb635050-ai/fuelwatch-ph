# 2026-10-07 通话短信验证

实际本地输出：
```
node tools/validate_network.mjs
PASS network: 31 dated official offers; 7 provider checks; billing periods distinct; no inferred effective dates
PASS calls/SMS: separate package benefits and 8 sourced per-unit references; historical dates retained
node docs/acceptance.mjs all
PASS stations: total=10842 >=10500; missing_coordinates=0; brands=40 <=40; no case variants
PASS prices: rows=18 >=15; source_url=http; as_of=2026-10-06 within 21 days; duplicates=0 (data/prices.json)
PASS page: openfreemap; clustered stations; no Marker; 非该站实测; dated history
PASS direct categories {"regularRates":8,"callSmsRows":12,"historicalDitoExplicit":true,"unknownNotFree":true,"overviewTab":0,"overviewCards":0,"navTabs":6,"categoryRows":{"water":27,"electricity":41,"lpg":11,"broadband":19,"mobile":12},"providerFilters":true,"returnedMapStations":10842,"mobileOverflow":false,"errors":[]}
```

本地截图calls-sms-local-regular及benefits已查看。2025DITO普通费率历史标识醒目；普通分钟/条费与套餐权益分开；手机无页面横向溢出，价格来源和采集日期分别保留。

冻结SHA256 CABD0D72A74F79132C7A4D537595D0CF31447407ED0FE92188203969551A90A9，未改docs/acceptance.mjs。普通费用的Smart/TNT缺口、未知套餐权益、国际/漫游与计费舍入未核实项在BLOCKED.md；不声称全国/所有套餐完整。


线上实际结果：
```
curl.exe -sI https://jyb635050-ai.github.io/fuelwatch-ph/
HTTP/1.1 200 OK
PASS direct categories {"regularRates":8,"callSmsRows":12,"historicalDitoExplicit":true,"unknownNotFree":true,"overviewTab":0,"overviewCards":0,"navTabs":6,"categoryRows":{"water":27,"electricity":41,"lpg":11,"broadband":19,"mobile":12},"providerFilters":true,"returnedMapStations":10842,"mobileOverflow":false,"errors":[]}
```
run37560036408 success，完整日志calls-sms-deploy-37560036408.txt。云端PLDT/Converge仍失败保留旧值，DITO通话短信从当次官网卡成功提取；普通资费与TNT/Go59权益人工日期不刷新。已查看线上普通费用截图，DITO四项明确2025历史来源，不能当今月新价。
