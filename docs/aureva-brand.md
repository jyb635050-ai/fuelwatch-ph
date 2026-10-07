# 衡价 · AUREVA

中文名称：衡价。英文名称：AUREVA。
副标题：菲律宾生活成本参考 · Philippines。
中文表达有依据地衡量价格；英文作为简洁字标使用，避免把品牌写成服务项目的长清单。

标志为几何字母A与水平衡量线；深墨蓝 #132D3C，香槟金 #DBC6A1，浅白 #F2F3F2。单纯色与简洁笔画适应16/32/64像素，原生SVG，无外部字体或位图依赖。图标64×64画布，圆角14，A主笔画4，水平线3。

桌面中英并列，手机中文在上、英文在下；功能和来源说明保持独立。品牌样式只处理页头，不改变价格高低的语义配色。

实际交付：aureva-icon.svg、brand.css、index.html页头/标题/favicon/application-name；每日公用费用与每周燃油发布都带品牌资源。旧图标和原有资料保留，升级前副本在work/brand-oct07。

本地验证结果：地图10842站、5个价格总览板块；中文/英文名称准确；SVG加载成功；320/390px页面无横向溢出；脚本errors=[]。冻结原验收all全绿，SHA256 CABD0D72A74F79132C7A4D537595D0CF31447407ED0FE92188203969551A90A9。


线上交付实际输出：
```
curl.exe -sI https://jyb635050-ai.github.io/fuelwatch-ph/
HTTP/1.1 200 OK
curl.exe -sI https://jyb635050-ai.github.io/fuelwatch-ph/aureva-icon.svg
HTTP/1.1 200 OK
node tools/browser_brand.mjs --online
PASS bilingual brand {"title":"衡价 AUREVA · 菲律宾生活成本参考","chinese":"衡价","english":"AUREVA","iconLoaded":true,"mapStations":10842,"overviewPanels":5,"mobileWidths":[390,320],"mobileOverflow":[false,false],"errors":[]}
node tools/test_provider_dates.mjs
PASS provider dates: current automatic observation accepted; manual review unchanged; refreshed manual and future dates rejected
```

品牌图标金/蓝对比8.58:1；字标/背景13.79:1。已查看本地页头/手机、线上页头。云端run37554864130全流程success，实际日志docs/aureva-deploy-37554864130.txt；首次失败证据aureva-first-deploy-failure.txt。新增供应商日期校验以verification_method分别约束人工reviewed_at及自动checked_at；不会把人工价表日期刷新成每天。
