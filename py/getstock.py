import requests
import json
from bs4 import BeautifulSoup as soup

# e.g. symbol=00005
URL = "http://www.aastocks.com/tc/stocks/quote/detail-quote.aspx?symbol="


def get_stock_info(stock_code):
    url = URL + stock_code
    headers = {
        "Referer": f"http://www.aastocks.com/tc/stocks/quote/quick-quote.aspx?symbol={stock_code}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36"
    }
    sess = requests.session()
    html = sess.get(url, headers=headers).text
    data = soup(html, "html.parser")
    # search stock name
    searched = "cp_ucStockBar_litInd_StockName"
    tag = data.find("span", id=searched)
    stock_name = tag.text
    # search price
    searched = "#labelLast span"
    tags = data.select(searched)
    price = float(tags[0].text.strip())
    # search price change
    searched = "vat min colChg"
    tags = data.find("td", class_=searched).find_all("div")
    change = float(tags[3].text)
    # up/down/no word
    updn = "up" if change > 0 else "down" if change < 0 else "no"
    # reture result
    return {"code": stock_code, "name": stock_name, "price": price, "change": abs(change), "updn": updn}

def stocks_info():
    stockList = []
    stocks = ["00001", "00005", "00011", "00700", "00082", "09988"]
    for stock in stocks:
        info = get_stock_info(stock)
        stockList.append(info)
    return stockList

print(json.dumps(stocks_info(), indent=4))