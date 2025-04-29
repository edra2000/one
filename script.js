document.addEventListener('DOMContentLoaded', function() {
  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  const errorMessage = document.querySelector('.error-message');

  // رموز العملات المطلوبة
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
  const apiUrl = `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`;

  function displayError(msg) {
    loadingMessage.style.display = 'none';
    errorMessage.innerHTML = `${msg} <button onclick="fetchData()">إعادة المحاولة</button>`;
  }

  async function fetchData() {
    try {
      loadingMessage.textContent = "جارٍ تحميل البيانات...";
      const response = await fetch(apiUrl);
      
      if (!response.ok) throw new Error(`خطأ HTTP: ${response.status}`);
      
      const data = await response.json();
      if (!data.length) throw new Error("لا توجد بيانات");
      
      renderData(data);
      loadingMessage.style.display = 'none';
      
    } catch (error) {
      displayError(`فشل التحميل: ${error.message}`);
    }
  }

  function renderData(tickers) {
    gridContainer.innerHTML = '';
    
    tickers.forEach(ticker => {
      const change = parseFloat(ticker.priceChangePercent);
      const card = document.createElement('div');
      card.className = 'crypto-card';
      card.innerHTML = `
        <div class="symbol">${ticker.symbol.replace('USDT', '')}</div>
        <div class="price">${parseFloat(ticker.lastPrice).toFixed(2)} USD</div>
        <div class="change ${change >= 0 ? 'positive' : 'negative'}">
          ${change.toFixed(2)}%
        </div>
        <div class="volume">حجم التداول: ${(ticker.volume / 1000).toFixed(1)}K</div>
      `;
      gridContainer.appendChild(card);
    });
  }

  fetchData(); // التشغيل الأولي
});
