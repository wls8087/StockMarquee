"use strict";

var Source_marketStatus = function() {

	var _self 				= this,
		_marketStatus		= null,
		URLNeededToRequest 	= "http://finance.now.com/api/getAfeQuote.php?item=allindex"; /* 市場狀態 */

	this.getMarketStatus = function(openingCallback, closingCallBack, failCallBack) {
		_doRequest(URLNeededToRequest, function() { 
			if(_marketStatus == "開市中") 	openingCallback(_marketStatus);	/* Determine opening or closing */
			else 							closingCallBack(_marketStatus);
		}, function() { failCallBack(); }); /* Failed */
	}

	var _doRequest = function(url, sucessCallback, failCallBack) {
		$.ajax({
			url 		: url,
			type 		: "GET",
			dataType 	: "json",
			cache 		: false,
			beforeSend: function(xhr) { xhr.overrideMimeType("text/plain; charset=BIG5"); }
		}).done(function(data) { /* Success */
			_statusInChi(data.indexInfos[0].status);
			sucessCallback();
		}).fail(function() {
            failCallBack();
		});
	}

	var _statusInChi = function(status) {
		if(status == "CT" || status == "MA" || status == "OI" || status == "NC" || status == "BL") 
			_marketStatus = "開市中";
		else
			if(status == "CL" || status == "OC")
				_marketStatus = "中午收市";
			else if(status == "DC")
				_marketStatus = "全日收市";
			else if(status == "OI" || status == "NC")
				_marketStatus = "競價時段";
			else if(status == "MA" || status == "BL")
				_marketStatus = "準備開市";
			else
				_marketStatus = "已收市";
	}
};