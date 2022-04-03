"use strict";

var Source_stockList = function () {

    var _self = this,
        _stockList = [],
        loadedTime = 0,
        URLNeededToRequest = [
            {"股本證券": "https://www1.hkex.com.hk/hkexwidget/data/getequityfilter?all=1"},
            {"交易所買賣產品": "https://www1.hkex.com.hk/hkexwidget/data/getetpfilter?all=1"},
            {"衍生權證": "https://www1.hkex.com.hk/hkexwidget/data/getdwfilter?all=1"},
            {"牛熊證": "https://www1.hkex.com.hk/hkexwidget/data/getcbbcfilter?all=1"},
            {"房地產投資信託基金": "https://www1.hkex.com.hk/hkexwidget/data/getreitfilter?all=1"},
            {"債務證券": "https://www1.hkex.com.hk/hkexwidget/data/getdebtfilter?all=1"}
        ];

    this.init = function ($symbolMsg, sucessCallback, failCallBack) {
        var tokenURL = 'http://www.hkex.com.hk/Market-Data/Securities-Prices/Equities?sc_lang=en';
        $.ajax({
            url: tokenURL,
            type: 'GET',
            dataType: 'text',
            cache: false
        }).done(function (response) {
            var token = response.replace(/[\S\s]+Base64-AES-Encrypted-Token";[^"]+"([^"]+)[\S\s]+/g, "$1");
            for (var i in URLNeededToRequest)
                for (var stockType in URLNeededToRequest[i]) {
                    _doRequest(stockType, URLNeededToRequest[i][stockType] + '&token=' + token + '&qid=' + Date.now(), function (stockType) {
                        $symbolMsg.text('正在載入: ' + stockType);
                        if (++loadedTime === URLNeededToRequest.length) {
                            /* 手動加入 HSI */
                            _stockList.push('HSI 恆指 恆生指數');
                            /* 手動加入 HSCEI */
                            _stockList.push('HSCEI 國企 恆生中國企業指數');
                            /* All Sources have been loaded */
                            sucessCallback(_stockList);
                        }
                    }, function () {
                        /* Failed */
                        failCallBack();
                    });
                }
        });

    }

    var _doRequest = function (stockType, url, sucessCallback, failCallBack) {
        $.ajax({
            url: url + '&lang=chi',
            type: "GET",
            dataType: "jsonp",
            cache: false
        }).done(function (response1) {
            $.ajax({
                url: url + '&lang=eng',
                type: "GET",
                dataType: "jsonp",
                cache: false
            }).done(function (response2) {
                if (response1.data.responsecode === '000' && response2.data.responsecode === '000') {
                    for (var i = 0; i < response1.data.stocklist.length; i++) {
                        _stockList.push([
                            response1.data.stocklist[i].ric.replace('.HK', ''),
                            response1.data.stocklist[i].nm,
                            response2.data.stocklist[i].nm
                        ].join(' '));
                    }
                    sucessCallback(stockType);
                } else {
                    failCallBack();
                }
            }).fail(function () {
                failCallBack();
            });
        }).fail(function () {
            failCallBack();
        });
    }
};