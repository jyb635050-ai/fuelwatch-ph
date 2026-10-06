# 2026-10-06 实际校验记录

原冻结 docs/acceptance.mjs 未修改；SHA256 CABD0D72A74F79132C7A4D537595D0CF31447407ED0FE92188203969551A90A9。

实际新校验的失败与修复：

1. node tools/validate_network.mjs 首次红：assert(/^\d{4}-\d{2}-\d{2}$/.test(r.observed_at)&&r.observed_at<=data.checked_at)。新增实际人工核验10月6日，旧自动检查10月5日。汇总checked_at改取两个实际核验日的较晚值，各公司原日期不改。
2. 第二次红：assert(r.speed_mbps>0||(r.speed_mbps===null&&r.status==='manual-verified'&&/day|night/i.test(r.conditions)))。SKY两套餐conditions是实际时段，没有Day/Night英文。改为检查套餐实际Day/Night名字以及条件07:00与19:00时段，允许未合成的分档速率null；价格/速率证据不变。第三次PASS。
3. 浏览器首次红：locator.selectOption: Timeout 30000ms exceeded；did not find some options。测试写成Clark Electric Distribution Corporation，实际数据和官网简称Clark Electric；修正测试名称后通过。没有删除断言或改变价格。

以下为实际命令最终输出：

```
node tools/validate_network.mjs
PASS network: 31 dated official offers; 7 provider checks; billing periods distinct; no inferred effective dates
node tools/validate_providers.mjs
PASS providers: dated official sources, positive numeric tariffs, explicit gaps and separate units; {"water":{"providers":14,"numeric_providers":9,"rows":27},"electricity":{"providers":14,"numeric_providers":11,"rows":41},"lpg":{"providers":1,"numeric_providers":1,"rows":11}}
node docs/acceptance.mjs all
PASS stations: total=10842 >=10500; missing_coordinates=0; brands=40 <=40; no case variants
PASS prices: rows=18 >=15; source_url=http; as_of=2026-09-29 within 21 days; duplicates=0 (data/prices.json)
PASS page: openfreemap; clustered stations; no Marker; 非该站实测; dated history
```

本次没有改原始价格表和冻结验收，原任务价格URL反向验证红绿证据保留在既有docs验收记录。本次增加的是多公司研究与UI，不将旧资料声称当前全覆盖。


线上实际验证：
```
curl.exe -sI https://jyb635050-ai.github.io/fuelwatch-ph/
HTTP/1.1 200 OK
node tools/browser_providers.mjs --online
PASS provider browser {"rendered":10842,"waterProviders":14,"electricityProviders":14,"lpgRegions":11,"networkProviders":7,"broadband":19,"mobile":12,"filters":true,"minimumMonthlyUnits":true,"generationOnlyLabel":true,"missingPriceLabel":true,"mobileOverflow":false,"errors":[]}
gh run view 37394137446 --json status,conclusion,url
{"conclusion":"success","status":"completed","url":"https://github.com/jyb635050-ai/fuelwatch-ph/actions/runs/37394137446"}
```
完整真实云端日志：docs/providers-cloud-run-37394137446.txt。线上截图providers-online-map、overview、water、electricity、network、mobile.png；截图已查看水务及全国地图。地图当周源未发布前诚实显示归档参考/灰点，保留既有周更新策略。
