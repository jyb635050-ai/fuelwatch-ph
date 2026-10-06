# 菲律宾水务官网价格调查（2026-10-06）

## 结论与口径

不只有 Maynilad。已读官方文件/页面后，形成 14 家供应商、27 条类别记录；9 家有数字（22 条），5 家只录来源/缺口（null）。这不是全国水务覆盖完成。水务公司通常按服务区、用户类别、水表口径、用水阶梯计费，同一商户一般不能自由切换异地区公司。最低首 10m³ 的 PHP/month 不能除以 10 冒充 PHP/m³；平均基本费也不能和最终账单比较。

JSON：`data/research-water-20261006.json`。observed_at 是本次实际官网观察日；effective_date 只在文件明确到日时填写。月度生效只用 tariff_period 保存，不猜日期。无日期文件不声称2026才生效。未采集真实店家账单。

## 已核对的费率来源

|供应商|服务区|半寸住宅最低费 PHP/month|半寸商业最低费 PHP/month|官方价目时间与限制|
|---|---|---:|---:|---|
|Manila Water|Greater Manila East Zone、Rizal|210.43|本次不取business group大表|2026-01-01标准基本水费；非全账单；优惠资格、环境费、季度FCDA、维护费及税另算|
|Maynilad|Greater Manila West Zone、部分Cavite|不适用|不适用|2026-10-01 FCDA通知中的52.86 PHP/m³仅average basic reference|
|Balanga WD|Balanga,Bataan|165.00|330.00|官网称January2025；同官网2025-09 MDS称2025-02-01且部分阶梯差0.01，保留冲突不擅裁|
|Puerto Princesa City WD|Puerto Princesa,Palawan|280.00|560.00|网页没有生效日；另septage PHP2/m³实际用量|
|Palayan City WD|Palayan,Nueva Ecija|235.00|470.00|Effective September2025 billing；月内具体生效日未写|
|Panabo WD|Panabo,Davao del Norte|245.97|491.94|2023-02-01；VAT inclusive；官网没有明确口径字段，因此JSONmeter_size为null|
|Metropolitan Naga WD|Naga,Camarines Sur|160.00|320.00|2026年LWUA BoardResolution22；具体生效日未写|
|Malaybalay City WD / PrimeWater|Malaybalay,Bukidnon|188.16|376.32|2024-01-01；VAT inclusive；图片2026年上传不等于2026新费率|
|Calbayog City WD|Calbayog,Samar|287.00|574.00|官方PDF没有生效日、完整税费说明|

数字均按源表逐档录入，JSON tariff 保存 commodity 阶梯。Commercial A/B等类别只录已清晰显示的半寸档；大口径和未核对适用关系没有虚构覆盖。

1. Manila Water 实际读取一页官方 PDF：[2026 Standard Rates](https://mediafiles.manilawater.com/public/pages/671b900c531a3dbe8f0608a2/bill-info/2026-Standard-Rates-Tariff-Table-Original-Signed.pdf)。住宅首10定额、后续阶梯明确；2026-01-01通知。PDF中的0.70% FCDA是January口径，不能作为October现行FCDA。保留基础收费而不估算最终账单。
2. Maynilad 实际读取 [October2026 FCDA通知](https://www.mayniladwater.com.ph/notice-to-maynilad-customers-foreign-currency-differential-adjustment-fcda-effective-october-1-2026/)，发布2026-09-15，生效2026-10-01。52.86只是机制引用的平均基本费。
3. Balanga 实际读取 [价目网页](https://balangawater.gov.ph/water-rates/) 和 [2025-09 MDS](https://balangawater.gov.ph/wp-content/uploads/2025/10/09-MDS-September-2025.pdf) 的present water rates。首档一致，部分commercial分档网页与MDS相差1分，因此effective_date null、源表差异明示。另加2%franchise tax。
4. Puerto Princesa 实际读取 [官方价目](https://ppcwater.gov.ph/water-rates/) 与 [FAQ](https://ppcwater.gov.ph/faqs/)。价目末尾明确septage PHP2/m³。Commercial A半寸后续单元格空白，不跨行补数据；只取住宅、工业商业及清楚的Commercial B。
5. Palayan 实际读取 [价目](https://pcwd.gov.ph/water-rates) 及 [About](https://pcwd.gov.ph/about) 确认pcwd域是Palayan，不能误当Puerto Princesa/Panabo。大口径累计表有疑似输入错误，本次只记录清晰½寸阶梯。
6. Panabo 实际读取 [价目](https://panabowaterdistrict.gov.ph/water-rates/)；VAT inclusive、13%adjustment生效2023-02-01明示。未擅加口径或新增税项。
7. Naga 实际读取 [Water Rates](https://www.mnwd.gov.ph/water-rates/)。不是同站Service Rates and Tariffs（那个是重接/实验室/罚金而不是水价）。网站明确2026年Resolution22，但未写生效日。
8. Malaybalay 实际读取官方页面与 [完整价目图片](https://www.emcwd.gov.ph/wp-content/uploads/2026/01/item3_Water-Rates-by-Type-of-Consumers-and-Cost-of-Water-per-cubic-meter-after-minimum-charge-CY-2024_item3_001.png)。图片抬头确证Malaybalay/PrimeWater，生效2024-01-01。重要防错：emcwd.gov.ph的MCWD不是Metro Cebu！
9. Calbayog 实际读取 [一页官方WaterRates PDF](https://www.ccwd.gov.ph/files/WATER%20RATES.pdf)，没有效日期，不能赋予抓取日为生效日。

## 已查而未确数的缺口

- Metro Cebu：正确官网 [mcwd.gov.ph](https://www.mcwd.gov.ph/)，主页可辨识供应商，费率页面本轮直接读取超时；2026-04调价数字仅找到媒体/第三方转录，按官网限定不纳入。不可用Malaybalay图片代替Cebu。
- Davao：[官方费率入口](https://web.davao-water.gov.ph/services/rates) 是JS应用，直接抓取403/JS壳；[调价新闻](https://web.davao-water.gov.ph/news/post?link=zaOrapjKteTvjjpUHUgM&title=DCWD%2520implements%252012.5%252525%2520water%2520rate%2520adjustment%2520in%2520March%25202026%2520billing)说明February2026用量/March2026账单12.5%调整，但不能在2019价目上自行乘算现在收费。null。
- Baguio：实际读取 [2022 ARTA旧宪章](https://baguiowaterdistrict.gov.ph/wp-content/uploads/2022/05/BWD-ARTA-HANDBOOK-2022.pdf)，已知这是旧表，2025/2026最新价未确证，不拿旧数字充当现行。
- Bacolod：[2026CitizenCharter官网页面](https://www.baciwa.gov.ph/baciwa-citizens-charter/) 搜索可见，直接读取403；未取得当前费率，null。
- Cagayan de Oro：[2026-06-09官方市政府文章](https://cagayandeoro.gov.ph/index.php/item/4002-abaday-calls-for-review-of-40-percent-cowd-water-rate-hike-bid.html) 只描述40%拟议加价，拟从218到294不代表批准实施，因此null。

## 全国目录与覆盖限制

官方入口：[LWUA Water Districts](https://lwua.gov.ph/water-districts/)、[DAP/RBPMS地方水务名单](https://rbpms.dap.edu.ph/agency/local-water-district/?sb_active=locwaterdist)、[政府FOI Water Districts](https://www.foi.gov.ph/en/sectors/water-districts/)。这些是确认全国存在多家地区水务的目录入口，不是统一费率API。LWUA直接读取403，目录不能据此给出本轮未验证的全国总家数。

本次优先NCR、Luzon、Visayas与Mindanao多区域，未完整覆盖地方LGU自营、小型私营、社区/分表转售、全部水表口径、连接费、维护/环保/排污/税费组合。所有数字仅代表其官方源表口径，网站应展示适用地区、类别、首档/后续阶梯和缺口，不能排一张跨地区假装可自由选择的“最便宜水商”榜单。
