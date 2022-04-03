function getStockInfo(stockCode, successCallBack, failCallBack) {
  var _status = null,
    _stockName = null,
    _lastUpdateTime = null,
    _currentPrice = null,
    _changeValue = null,
    _changeRate = null,
    _todayRange = null,
    _fifteenTwo = null,
    _dealVolume = null,
    _dealPrice = null,
    StockURLRequest = "http://hq.sinajs.cn/list=rt_hk",  /* 股票 */
    IndexURLRequest = "http://hq.sinajs.cn/list=rt_hk"   /* 指數 */

  var symbol = stockCode

  $.ajax({
    url: StockURLRequest + symbol,
    type: "POST",
    dataType: "text",
    cache: false,
    beforeSend: xhr => xhr.overrideMimeType("text/plain; charset=gb2312")
  })
    .done(data => {
      data = data.substring(data.indexOf('"') + 1, data.lastIndexOf('"')).split(",");

      var perPrice = parseFloat(data[3]);
      _currentPrice = parseFloat(data[6]).toFixed(3); /* 現價 	: 122.800 */
      //    _status = _currentPrice < perPrice ? 1 : _currentPrice > perPrice ? 2 : 0; /* 升(2), 跌(1), 平(0) */
      _status = _currentPrice < perPrice ? "跌" : _currentPrice > perPrice ? "升" : "平"; /* 升(2), 跌(1), 平(0) */
      _stockName = convert_trad(data[1]); /* 汇丰控股 -> 匯豐控股 */
      _lastUpdateTime = data[17] + " " + data[18]; /* 最後更新	: 2014/03/21 16:01 */
      _changeValue = (_currentPrice - perPrice).toFixed(3); /* 升跌		: 2.200 */
      _changeRate = (((_currentPrice - perPrice) / perPrice) * 100).toFixed(2) + "%"; /* 升跌(%) 	: 1.824% */
      _todayRange = [data[5], data[4]]; /* 今日波幅 : [121.400, 123.100] */
      _fifteenTwo = [data[16], data[15]]; /* 52週波幅 : [98.000, 127.000] */
      _dealVolume = parseFloat(data[12]).toChiUnit(3) + "股"; /* 成交量  	: 4.690 百萬股 */
      _dealPrice = parseFloat(data[11]).toChiUnit(3); /* 成交金額 : 5.740 億 */

      res = {
        "編號": symbol,
        "名稱": _stockName,
        "現價": _currentPrice,
        "升跌": _status,
        "升跌金額": _changeValue,
        "升跌%": _changeRate,
        "今日波幅": _todayRange,
        "52週波幅": _fifteenTwo,
        "成交量": _dealVolume,
        "成交金額": _dealPrice
      }
      successCallBack(res)
    })
    .fail(err => {
      res = { "編號": "" }
      failCallBack(res)
    })
}
