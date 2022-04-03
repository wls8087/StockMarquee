import requests


# $.ajax({
#     url: StockURLRequest + symbol,
#     type: "POST",
#     dataType: "text",
#     cache: false,
#     beforeSend: xhr= > xhr.overrideMimeType("text/plain; charset=gb2312")
# })

url = "http://hq.sinajs.cn/list=rt_hk00005"
headers = {
    "Accept": "text/plain",
    "Content-Type": "text/plain; charset=gb2312"
}



res = requests.post(url, headers=headers)
print(res.status_code)