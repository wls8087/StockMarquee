const REFRESH_STOCK_SECOND = 60
const STOCKS_MARQUEE_SPEED = 8000
const TEST_MARQUEE_SPEED = 10000

var updateStocksTimeout
var stockList = $("#stock-list");

$(document).ready(function () {
  ("use strict");

  makeStockList();
  stockList.marquee({ duration: STOCKS_MARQUEE_SPEED });
  $(".test").marquee({ duration: TEST_MARQUEE_SPEED });

  updateStocksTimeout = setInterval(updateStocks, REFRESH_STOCK_SECOND * 1000);
});

function trimLastZero(value) {
  if (value.endsWith("0"))
    return value.substr(0, value.length - 1)
  else
    return value
}

function trimFirstMinus(value) {
  if (value.startsWith("-"))
    return value.substr(1, value.length - 1)
  else
    return value
}

function makeStockList() {
  BLUE_CHIPS.forEach(function (e) {
    // clear values
    e.showStockCode = e.code.substring(0, 1) == "0" ? e.code.substring(1, 5) : e.code;
    e.name = e.name.replace(" ", "");
    e.price = parseFloat(e.price);
    e.change = 0;
    e.updn = "no";

    insertStock(e);
    updateStock(e.code);
  })
}

function insertStock(e) {
  var ele = `
    <div class="stock" data-stock="${e.code}">
      <div class="stock-code">${e.showStockCode}</div>
      <div class="stock-name">${e.name}</div>
      <div class="stock-price value-same">${e.price}</div>
      <div class="stock-updn triangle-none"></div>
      <div class="stock-change value-none">${e.change}</div>
    </div>
    `;
  stockList.append(ele);
}

function updateStocks() {
  var currTime = new Date().toTimeString().slice(0, 5);
  if (currTime >= "09:00" && currTime <= "16:30")
    clearTimeout(updateStocksTimeout)
  else
    BLUE_CHIPS.forEach(e => { updateStock(e.code) })
}

function xxupdateStock(stockCode) {
  getStockInfo(stockCode, data => {
    // data = {
    //   "編號": symbol,
    //   "名稱": _stockName,
    //   "現價": _currentPrice,
    //   "升跌": _status,
    //   "升跌金額": _changeValue,
    //   "升跌%": _changeRate,
    //   "今日波幅": _todayRange,
    //   "52週波幅": _fifteenTwo,
    //   "成交量": _dealVolume,
    //   "成交金額": _dealPrice
    // }

    currentPrice = trimLastZero(data["現價"])
    currentChange = trimFirstMinus(trimLastZero(data["升跌金額"]))

    stock = $("div").find(`[data-stock='${stockCode}']`)
    updn = stock.find(".stock-updn")
    price = stock.find(".stock-price").html(currentPrice);
    change = stock.find(".stock-change").html(currentChange);

    updn.removeClass("triangle-up triangle-down triangle-none")
    price.removeClass("value-up value-down value-same")
    change.removeClass("value-up value-down value-none")
    if (data["升跌"] == "升") {
      updn.addClass("triangle-up")
      price.addClass("value-up")
      change.addClass("value-up")
    }
    else if (data["升跌"] == "跌") {
      updn.addClass("triangle-down")
      price.addClass("value-down")
      change.addClass("value-down")
    }
    else {
      updn.addClass("triangle-none")
      price.addClass("value-same")
      change.addClass("value-none")
    }
  })
}

function updateStock(stockCode) {
  var stockinfo_url = "http://ecc23880113.ddns.net/stockinfo/"

  // find the stock-name and add class blink
  $("div").find(`[data-stock="${stockCode}"]`).find(".stock-name").addClass("blink")

  fetch(stockinfo_url + stockCode)
    .then(res => res.json())
    .then(data => {
      // find the stock in html and assign values
      stock = $("div").find(`[data-stock="${stockCode}"]`)
      stockName = stock.find(".stock-name")
      stockUpdn = stock.find(".stock-updn")
      stockPrice = stock.find(".stock-price")
      stockChange = stock.find(".stock-change")

      stockPrice.html(data.price.toFixed(2));
      stockChange.html(data.change.toFixed(2));

      // make stock name not blink
      stockName.removeClass("blink")

      stockUpdn.removeClass("triangle-up triangle-down triangle-none")
      stockPrice.removeClass("value-up value-down value-same")
      stockChange.removeClass("value-up value-down value-none")
      if (data.updn == "up") {
        stockUpdn.addClass("triangle-up")
        stockPrice.addClass("value-up")
        stockChange.addClass("value-up")
      }
      else if (data.updn == "down") {
        stockUpdn.addClass("triangle-down")
        stockPrice.addClass("value-down")
        stockChange.addClass("value-down")
      }
      else {
        stockUpdn.addClass("triangle-none")
        stockPrice.addClass("value-same")
        stockChange.addClass("value-none")
      }
    })
}
