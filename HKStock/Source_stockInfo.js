"use strict";

var Source_stockInfo = function() {

	var _self 				= this,

		_status				= null,
		_stockName			= null,
		_lastUpdateTime		= null,
		_currentPrice		= null,
		_changeValue		= null,
		_changeRate			= null,
		_todayRange			= null,
		_fifteenTwo			= null,
		_dealVolume			= null,
		_dealPrice			= null,

		StockURLRequest 	= "http://hq.sinajs.cn/list=rt_hk", 	/* 股票 */
		IndexURLRequest 	= "http://hq.sinajs.cn/list=rt_hk" 		/* 指數 */;

	this.getStockInfo = function(symbol, successCallback, failCallback) {
		if(isNaN(symbol)) {
			 /* Symbol is not number so that it is index (指數) */
			_doRequestIndex(IndexURLRequest + symbol, function() {
				successCallback(
					_status, 
					_stockName, 
					_lastUpdateTime, 
					_currentPrice, 
					_changeValue, 
					_changeRate, 
					_todayRange, 
					_fifteenTwo, 
					_dealVolume, 
					_dealPrice
				);
			}, function() { failCallback(); });
		} else {
			symbol = symbol.length === 4 ? "0" + symbol : symbol;
			/* It is number means normal stock (股票窩輪牛熊證) */
			_doRequestStock(symbol, StockURLRequest + symbol, function() {
				successCallback(
					_status, 
					_stockName, 
					_lastUpdateTime, 
					_currentPrice, 
					_changeValue, 
					_changeRate, 
					_todayRange, 
					_fifteenTwo, 
					_dealVolume, 
					_dealPrice
				);
			}, function() { failCallback(); });
		}
	}

	var _doRequestStock = function(symbol, url, successCallback, failCallback) {
		$.ajax({
			url 		: url,
			type 		: "POST",
			dataType 	: "text",
			cache 		: false,
			beforeSend: function(xhr) { xhr.overrideMimeType("text/plain; charset=gb2312"); }
		}).done(function(data) { /* Success */
			data = data.substring(data.indexOf('"')+1, data.lastIndexOf('"')).split(',');

			var perPrice		= parseFloat(data[3]);
			_currentPrice 		= parseFloat(data[6]).toFixed(3); 									/* 現價 	: 122.800 */
			_status				= (_currentPrice < perPrice) ? 1 : ((_currentPrice > perPrice) ? 2 : 0); 		/* 升(2), 跌(1), 平(0) */
			_stockName 			= convert_trad(data[1] + " " + symbol); 									/* 汇丰控股 -> 匯豐控股 0005 */
			_lastUpdateTime 	= data[17] + ' ' + data[18]; 													/* 最後更新	: 2014/03/21 16:01 */
			_changeValue 		= (_currentPrice - perPrice).toFixed(3); 							/* 升跌		: 2.200 */
			_changeRate			= ((_currentPrice - perPrice) / perPrice * 100).toFixed(2) + "%"; 	/* 升跌(%) 	: 1.824% */
			_todayRange 		= data[5] + " - " + data[4]; 													/* 今日波幅 : 121.400 - 123.100 */
			_fifteenTwo 		= data[16] + " - " + data[15]; 													/* 52週波幅 : 98.000 - 127.000 */
			_dealVolume 		= parseFloat(data[12]).toChiUnit(3) + "股"; 								/* 成交量  	: 4.690 百萬股 */
			_dealPrice 			= parseFloat(data[11]).toChiUnit(3); 										/* 成交金額 : 5.740 億 */

			successCallback();
		}).fail(function() { failCallback(); });
	}

	var _doRequestIndex = function(url, successCallback, failCallback) {
		$.ajax({
			url 		: url,
			type 		: "POST",
			dataType 	: "text",
			cache 		: false,
			beforeSend: function(xhr) { xhr.overrideMimeType("text/plain; charset=gb2312"); }
		}).done(function(data) {
			data = data.substring(data.indexOf('"')+1, data.lastIndexOf('"')).split(',');

			var perPrice		= parseFloat(data[3]);
				_currentPrice 	= parseFloat(data[6]).toFixed(3);
				_status			= (_currentPrice < perPrice) ? 1 : ((_currentPrice > perPrice) ? 2 : 0);
				_stockName 		= convert_trad(data[1] + ' ' + data[0]);
				_lastUpdateTime = data[17] + ' ' + data[18];
				_changeValue 	= (_currentPrice - perPrice).toFixed(3);
				_changeRate		= ((_currentPrice - perPrice) / perPrice * 100).toFixed(2) + "%";
				_todayRange 	= data[5] + " - " + data[2];
				_fifteenTwo 	= data[16] + " - " + data[15];
				_dealVolume 	= "N/A";
				_dealPrice 		= "N/A";

			successCallback();
		}).fail(function() { failCallback(); });
	}
};