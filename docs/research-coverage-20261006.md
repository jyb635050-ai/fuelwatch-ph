# 菲律宾能源与通信供应商覆盖审计（2026-10-06）

已有水、电各一家只是早期采集覆盖，并非菲律宾市场只有一家。此轮报告是查明范围并补充有官网依据的价格，不能宣称全国价目已齐全。

## 可直接汇总

- 网络：实读新增 SKY 7 个宽带套餐、TNT 4 个流量套餐、Globe Go59 1 个流量套餐，共 12 条，详见同名 JSON 的 network_offers。
- [SKY 官网](https://www.mysky.com.ph/skyfiber)：五档固定宽带 100/300/500/700/1000 Mbps 月费分别为 PHP 999/1500/2000/2500/3500；最低档安装 1500，其他免费安装。另有两档日夜不同速率套餐，每月 1699，仅部分 Metro Manila 地址可用。合同期限未核实，留空。
- [TNT All Access+ 官网](https://tntph.com/Pages/all-access)：PHP 99 / 15 天，5 GB 全网数据、无限全网通话短信。不要误读相邻 SPP 一行的 7 GB。
- [TNT 5G 官网](https://tntph.com/Pages/promos)：299 / 7 天、599 / 30 天、799 / 30 天，5G 区域无限数据，非 5G 额外额度分别 3/12/24 GB。官网 FAQ 未给更新日，应用实际可订阅性应再次核实。
- [Globe Go59 官网](https://www.globe.com.ph/prepaid/go-promos)：59 / 3 天，5 GB 全网 + 1 GB 仅 5G、无限全网短信。不能写成 6 GB 全网数据。
- LPG：新增 10 条官方历史观测范围，含 Mindanao、Region IV-A 总体及若干城市。全部按家庭 11 kg 瓶装 LPG 计，非管道天然气。9 月监测没有当成 10 月报价。Visayas 仅给监测月，未伪造具体日。

## 全国供应商基准

[DOE 配电公司目录](https://prod-cms.doe.gov.ph/documents/d/epimb/program-partners-distribution-utilities-pdf)为 2024 年 12 月版本，共 10 页，直接实读。名录含 ECs、私人 PIOUs、LGU-owned 和 Ecozone；本组没有可靠自动逐行计数，所以总数留空。

[NEA 2024 年报](https://nea.gov.ph/wp-content/uploads/2025/09/NEA-2024-Annual-Report_compressed.pdf)写有 121 家 ECs。这个数是该年度电力合作社范围，不是所有全国供电公司的总数，也不能冒充 2026 年实时数量。

[LWUA 水区目录](https://lwua.gov.ph/water-districts/)存在，但直接读取失败，按 agent-reach Jina 路由仍得到安全验证页。NWRB 本轮未核实到完整、最新、可读取全国公用水商名单，所以不写全国水商总数。[Manila Water 官方历史报告](https://reports.manilawater.com/2019/special-reports/concession-agreement-overview)可确认东区 Manila Water 与西区 Maynilad 的区域结构。

水、电对普通住宅或小店通常是按地址供区查费率；不同城市供应商不能当成可随意切换的全国竞价公司。不能拿平均基础水费替代店家分阶最终账单；不能拿居民电价替代商业/工业费率。

## LPG 扩展入口

- [North Luzon](https://doe.gov.ph/data-and-prices/lpg-monitor/north-luzon-lpg-prices)：9 月扫描 PDF 已实读，OCR 品牌列和小数不稳，本轮不把数字硬配品牌。
- [South Luzon](https://doe.gov.ph/data-and-prices/lpg-monitor/south-luzon-lpg-prices)：IV-A、IV-B、V 分开的官方 PDF。IV-A 范围 970–1480、常见价 1185；9 月 1–7 日历史观测。IV-B/V 点击本次失败，保留缺口。
- [Visayas](https://doe.gov.ph/data-and-prices/lpg-monitor/visayas-lpg-prices)：2026 年 9 月官方表按城市列价。只录清晰城市价范围，未猜空白品牌列。
- [Mindanao](https://doe.gov.ph/data-and-prices/lpg-monitor/mindanao-lpg-prices)：9 月 1–7 日监测 PDF 7 页，总体 970–1844、常见价 1335。来源是被监测网点范围，不是所有店家现价。

## 必须保留的缺口

Starlink 官方搜索索引有价格，实际读取仅 JS 壳，Jina 返回追踪图片快照；GOMO 搜索值有旧价冲突和促销日期，实际页没有可读取套餐值。二者暂不添价格。Eastern 确认存在家用服务但官网未读到公开价格；RISE 官网页以企业连接为主无可读家用价；Radius 读取错误。不能从评测、经销商报价或搜索片段补成官网实测。

完整性以“有日期的官方供应商清单 + 每一供应商的供区、客户类别、费率/公开缺失状态”衡量；当前可称覆盖扩展，不可称菲律宾全部公司全部最新价已齐。每条观察日期固定 2026-10-06；没有证实的 effective_date 保持 null，官网已看到的价并不保证该地址能办理。
