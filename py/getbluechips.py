import requests
import json
from bs4 import BeautifulSoup as soup

url = "http://content.etnet.com.hk/content/sywg/tc/securities_index.php?subtype=HSI"
res = requests.get(url)
data = soup(res.text, "html.parser")

# with open("bluechips.html", "w", encoding="utf=8") as f:
#     f.write(res.text)

stockList = []
rows = data.find_all("tr", {"class": ["RowGrey", "RowWhite"]})

for row in rows:
    td = row.find_all("td")
    # print(td, "\n")
    stockList.append({"code": td[0].text, "name": td[1].text,
                     "price": td[2].text, "change": 0, "updn": "no"})

with open("bluechips.js", "w") as f:
    f.write("const BLUE_CHIPS = " + json.dumps(stockList))
