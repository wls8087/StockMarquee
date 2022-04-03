
#### 藍籌股 [url](http://content.etnet.com.hk/content/sywg/tc/securities_index.php?subtype=HSI)

    http://content.etnet.com.hk/content/sywg/tc/securities_index.php?subtype=HSI


#### 個別股票 [url](http://www.etnet.com.hk/www/tc/stocks/realtime/quote.php?code=5)
    http://www.etnet.com.hk/www/tc/stocks/realtime/quote.php?code=5


#### html
    <div id="stock-list">  
      <div class="stock" data-stock="00005">
        <div class="stock-code">0005</div>
        <div class="stock-name">匯豐控股</div>
        <div class="stock-price value-up">54.10</div>
        <div class="stock-updn triangle-up"></div>
        <div class="stock-change value-up">0.60</div>
      </div>
      <div class="stock" data-stock="00011">
        <div class="stock-code">0011</div>
        <div class="stock-name">恆生銀行</div>
        <div class="stock-price value-down">152.60</div>
        <div class="stock-updn triangle-down"></div>
        <div class="stock-change value-down">0.60</div>
      </div>
      <div class="stock" data-stock="00941">
        <div class="stock-code">0941</div>
        <div class="stock-name">中國移動</div>
        <div class="stock-price value-same">54.70</div>
        <div class="stock-updn triangle-none"></div>
        <div class="stock-change value-none">0.00</div>
      </div>
    </div>


## Same python code

```{code-cell} ipython3
import numpy as np
data = np.random.randn(3, 100)
data[0, :10]
```