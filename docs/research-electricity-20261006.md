# 菲律宾电价官网扩充研究 — 2026-10-06

研究按第一性原理区分供应商专营服务区、用户类别和计费组成。同一地区通常受配电特许经营区域约束，不能把异地便宜电价当成用户可随便换公司的报价。电价的 kWh 能量收费、kW 需量收费、每客户月固定收费不同；住宅摘要不能当店家/工地商业账单。

## 实际读取结果

JSON: `data/research-electricity-20261006.json`。36 条，11 家公司：34 条用户类别数字、1 条仅发电分项、1 条整体价缺失但附部分费率结构。已有 Meralco 数据由主任务保留，本子任务不重复算新增。没有声称全国公司或各用户子类齐全。八/九月数据统一标 historical，表示对应公布月份，不能把 2026-10-06 读取日期当生效日期。

| 公司 / 区域 | 月份 | 官方用户参考 PHP/kWh | 口径与证据 |
|---|---|---|---|
| NEECO I / Nueva Ecija — NEECO I franchise area | 2026-09 | Residential: 11.812<br>Low Voltage: 10.9606<br>High Voltage: 8.8347 | [published_category_reference](https://neeco1.org/unbundled-power-rates) |
| CASURECO I / Camarines Sur — CASURECO I franchise area | 2026-09 | Residential: 12.8118<br>Low Voltage — Commercial, Industrial, Irrigation, Public Building, Street Lights: 11.7376<br>High Voltage — Industrial / Commercial: 10.8742 | [published_category_reference](https://www.casureco1.com/september-2026-effective-rates/) |
| CASURECO II / Camarines Sur — CASURECO II franchise area | 2026-09 | Residential: 10.3138<br>Low Voltage: 9.4385<br>High Voltage: 8.3346 | [published_category_reference](https://www.casureco2.com.ph/support/rates) |
| SURSECO II / Surigao del Sur — SURSECO II franchise area | 2026-09 | Residential: 14.1121<br>Low Voltage — Commercial, Industrial, Public Building, Street Lights: 12.922 | [published_category_reference](https://www.surseco2.com.ph/rates/PowerRates/2026/September%202026.png) |
| ZANECO / Zamboanga del Norte — ZANECO franchise area | 2026-09 | Residential: 14.1818<br>Low Voltage: 13.2084<br>Higher Voltage: 11.3195 | [published_category_reference](https://zaneco.ph/2026/09/23/power-rate-update-for-september-2026/) |
| BENECO / Baguio City and Benguet — BENECO franchise area | 2026-09 | Residential: 11.8038<br>LV Commercial: 11.1573<br>LV Industrial: 11.1573<br>HV Commercial: 9.2854 | [energy_rate_excluding_fixed_and_demand](https://www.beneco.com.ph/rates.php?q=custtype&custtype=Residential) |
| AKELCO / Aklan — AKELCO franchise area | 2026-08 | Residential — 21 kWh and up: 15.1481<br>Low Voltage Commercial: 14.2075<br>High Voltage Commercial: 11.9797 | [category_energy_reference](https://www.akelco.com.ph/rates.html) |
| OMECO / Mainland Occidental Mindoro — OMECO franchise area | 2026-09 | Residential: 12.5525<br>Commercial: 11.3229<br>Industrial: 11.6639<br>Large Load: 10.8514<br>Public Building: 10.4836<br>Street Light: 13.2548 | [published_category_reference](https://www.omeco.com.ph/) |
| MORE Power / Iloilo — MORE Power franchise area | 2026-09 | Residential: 14.4206<br>Intermediate: 13.0223<br>Commercial: 13.5523<br>Power: 13.6403<br>City Streetlights: 13.382<br>City Offices: 13.3689<br>Other Government: 12.8679 | [average_category_reference](https://morepower.com.ph/monthly-rates/) |
| Negros Power / Central Negros — Negros Power franchise area | 2026-09 | Generation charge only: 8.4217 | [generation_only](https://negrospower.ph/wp-content/uploads/2026/09/Generation-Rate-for-Posting_September-2026.pdf) |
| Clark Electric / Clark Freeport Zone | 2026-08 | Commercial — Primary / Secondary / Small: 暂无可合成总价 | [unbundled_tariff](https://www.clarkelectric.ph/node/164) |

## 人工核验与自动采集建议

- NEECO I、CASURECO I/II、AKELCO、MORE Power 为实际读取官网正文/HTML 表，不仅靠搜索摘要。MORE Power 读取2026年度表的 SEP 列，不能错拿2025同名九月列。月份虽确定，月内开始日期未见明确证据；effective_date=null。
- BENECO 主 rates.php 静态页面不含表。读取官网 main.js 得到公开接口 `rates.php?q=custtype&custtype=Residential`；同路由使用 LV Commercial、LV Industrial、HV Commercial。逐个实际请求，取9/2026行最后的 `Total Php/kWh`。住宅11.8038、LV商业/工业11.1573、高压商业9.2854，但固定费和需量费另列，严禁称全包单价。`q=month&monthyear=9/2026` 无数据，不能因此说BENECO无九月价；按用户类别接口可读。
- SURSECO II 通过 Rates2026 官网索引的九月图片读取：住宅14.1121、低压12.9220。高压工业显示0.0000，疑占位，未收录为数字。此文件人工图证读到低压包含 Commercial, Industrial, Public Building, Street Lights。
- ZANECO 官网九月23日公告第1页图片：住宅14.1818、低压13.2084、高压11.3195，单位/kWh。其用压分类保持原样，不能因为图标楼房就自行断言全部都是商业。
- OMECO 普通网页工具返回空正文，agent-reach Jina 阅读官网成功：POWER RATES As of Sep 2026 六类。出处仍用官网URL，不把Jina当价格发布者。
- Negros Power 九月PDF实际读取，总发电收费8.4217 PHP/kWh，Billing Cycle September 2026、采购覆盖2026-07-26至2026-08-25。只作分项信息，不参与全电价便宜排名。官网 overall summary 为2024年度未拿来冒充现在。
- Clark Electric 官方八月文章 admin发布日期显示2024-06-27，标题/图已更新2026-08，不能把旧后台日期当生效日期。月费率图同时列kWh/kW/每客户月金额：发电4.2825、输电1.5355；商业主/次压配电能量0.3960、需量192.37/241.17；主压供电固定2723.97、计量固定9823.68。price=null，不自行用未知工地用量合成价格。

## 未覆盖与阻塞

- **SURSECO II**：九月图高压工业列显示0.0000，未确认是否无客户/占位，不能当免费电，数值未收录。 [官方入口](https://www.surseco2.com.ph/rates/PowerRates/2026/September%202026.png)
- **Visayan Electric**：官网存在September 2026平均价栏目与注明0.75% Cebu LFT/不同load factor，但本轮静态正文未获取对应数值图。暂不录媒体报价，需后续浏览器提取图表。 [官方入口](https://www.visayanelectric.com/customer-services/faq)
- **Davao Light**：官网服务区可读；本轮未读到当前用户整体价，未用媒体/第三方数据填。 [官方入口](https://www.davaolight.com/)
- **Meralco**：原网站已有九月典型住宅14.7424参考。子任务web PDF读取受限，未复制以假装本轮新验证；商业完整九月价表仍需核。 [官方入口](https://meralcomain.s3.ap-southeast-1.amazonaws.com/2026-09/english_press_release-_meralco_september_2026_rates.pdf)
- **Nationwide**：NEA成功公开2026-03-31各合作社连接数目录，但xlsx旧签名重定向本轮不可访问；不能据此宣称全全国公司已覆盖。DOE旧DU目录链接实际Page Not Found，ERC distribution页面工具Internal Error。 [官方入口](https://www.foi.gov.ph/agencies/nea/list-of-electric-cooperatives-and-number-of-households/)

全国仍有大量未调查合作社，包括CEBECO I/II/III、PELCO系列、CEPALCO、SOCOTECO I/II、各岛屿地方配电公司；本轮不是全国完整价格库。应以上述 NEA/ERC 官方目录为后续名单，逐家核官网费率。不要把未调查表述成无公司/无价。

## 验证

所有数字来自当轮读取的供应商官网正文、价表或其官方关联图片/PDF；无媒体价、无猜价。来源字段全为http(s)，每行注明类别、区域、单位、对应月份、读取日期。负数、零占位没有混入用户整体价。后续UI须展示全部匹配行，并优先解释类别口径，再允许同类月度比较；异地配电商不是任意可替换的套餐。

