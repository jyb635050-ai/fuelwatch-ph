# 通话、短信官网核验 — 2026-10-07

数据：data/telecom-voice.json；普通资费与套餐包含权益分开。普通资费生效日未明确，effective_date均null。国际、漫游、特殊号码、长短信分段及计费舍入未核实。核验日期不表示本月新价。

- [Globe官方Prepaid](https://www.globe.com.ph/prepaid)：完整标准价表实际读取，Globe/TM6.50PHP/minute、其他手机7.50、座机7.50；国内手机SMS1PHP/条。未发布明确生效日期。
- [DITO官方文章](https://dito.ph/blog/buy-prepaid-load-online-philippines)：明确发布2025-02-12。网内6.50PHP/minute、其他网络/座机7.50、SMS1PHP/条。仅历史官方参考，当前是否沿用未确证，界面明示历史日期；未借抓取日声称2026新价。
- [DITO Level-Up](https://dito.ph/prepaid/level-up)：逐张现有129/169/199/299/499/999卡抓取，6个套餐分别含网内无限、300分钟其他手机网络、手机全网无限SMS。提取绑定到各卡，不拿NEW99的150分钟串到其他套餐；未把其他手机范围扩张成座机或国际。
- [TNT AllAccess](https://tntph.com/Pages/all-access)：99PHP/15days TNT行含5GB及无限通话短信；相邻SPP行无UACT且为7GB，不混用。座机/国际范围未核实。已存在的TNT5G纯数据相关页面未确证通话短信，保留未核实。
- [Globe Go59](https://www.globe.com.ph/prepaid/go-promos)：5GB通用+1GB仅5G，59PHP/3days、全网无限SMS；没有列明通话权益，不猜赠送。
- [Smart POWERALL99](https://store.smart.com.ph/smart-bro/power-all-99/1601900800.html)：产品说明实际仅8GB分享流量和TikTok，未列通话短信，标未核实；不能假设Smart全部套餐相同。Smart/TNT当前普通分钟短信资费未确证，不采用论坛、十年前旧论文。

自动化：DITO通话短信随原官网套餐卡抓取；Go59/TNT权益及普通费表人工核验2026-10-07后保留，自动发布不刷新人工日期。两个发布流程携带telecom-voice.json；所有屏幕引用官方原始URL。
