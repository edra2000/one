document.addEventListener('DOMContentLoaded', function () {
  const apiKey = '899fa072-efcb-4a2d-8e13-d276f0116416';
  const apiUrl = 'https://www.okx.com/api/v5/market/tickers?instType=SPOT&quoteCcy=USDT';
  const stableCoins = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'PAX'];
  const topCoinsOrder = ['BTC-USDT', 'ETH-USDT', 'BNB-USDT', 'SOL-USDT', 'XRP-USDT'];

  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  const errorMessage = document.querySelector('.error-message');

  function displayError(message) {
    loadingMessage.style.display = 'none';
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function fetchAndDisplayData() {
    fetch(apiUrl, {
      headers: {
        'X-API-KEY': apiKey
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        loadingMessage.style.display = 'none';
        gridContainer.style.display = 'grid';

        if (data && data.data && data.data.length > 0) {
          const filteredCoins = data.data
            .filter(ticker => {
              const base = ticker.instId.split('-')[0];
              const quote = ticker.instId.split('-')[1];
              return quote === 'USDT' && !stableCoins.includes(base);
            });

          const topCoins = [];
          const otherCoins = [];

          filteredCoins.forEach(ticker => {
            if (topCoinsOrder.includes(ticker.instId)) {
              topCoins.push(ticker);
            } else {
              otherCoins.push(ticker);
            }
          });

          otherCoins.sort((a, b) => parseFloat(b.vol24h) - parseFloat(a.vol24h));
          const sortedCoins = [...topCoins, ...otherCoins];

          gridContainer.innerHTML = '';

          sortedCoins.forEach(ticker => {
            const changeValue = parseFloat(ticker.change24h);
            const coinId = ticker.instId.replace(/[^a-zA-Z0-9]/g, '');
            const card = document.createElement('div');
            card.className = 'crypto-card';

            card.innerHTML = `
              <div class="symbol">${ticker.instId.split('-')[0]}</div>
              <div class="price">${parseFloat(ticker.last).toFixed(2)} USD</div>
              <div class="change ${changeValue >= 0 ? 'positive' : 'negative'}">
                ${changeValue.toFixed(2)}%
              </div>
              <div class="liquidity-chart" id="liquidity-${coinId}"></div>
              <div class="volume">Vol: ${parseFloat(ticker.vol24h).toLocaleString()}</div>
            `;

            gridContainer.appendChild(card);

            // نرسم مؤشر السيولة بعد التحقق من العنصر فعلياً
            const containerId = `liquidity-${coinId}`;

            function waitForContainerAndRender(retries = 10) {
              const container = document.getElementById(containerId);
              if (container) {
                const percent = Math.min(1, parseFloat(ticker.vol24h) / 100000000);
                const circle = new ProgressBar.Circle(container, {
                  color: '#00ff88',
                  trailColor: '#444',
                  trailWidth: 2,
                  duration: 1400,
                  easing: 'easeInOut',
                  strokeWidth: 6,
                  from: { color: '#00ff88' },
                  to: { color: '#ff3c3c' },
                  step: (state, circle) => {
                    circle.path.setAttribute('stroke', state.color);
                    const val = Math.round(circle.value() * 100);
                    circle.setText(val + '%');
                  }
                });
                circle.animate(percent);
              } else if (retries > 0) {
                setTimeout(() => waitForContainerAndRender(retries - 1), 100);
              } else {
                console.warn(`❗ لم يتم العثور على العنصر: ${containerId}`);
              }
            }

            waitForContainerAndRender(); // تشغيل رسم الدائرة بعد التأكد
          });
        } else {
          displayError("لا توجد بيانات أسعار من OKX.");
        }
      })
      .catch(error => {
        console.error('حدث خطأ أثناء الاتصال بـ OKX API:', error);
        displayError("حدث خطأ أثناء جلب بيانات الأسعار من OKX.");
      });
  }

  fetchAndDisplayData();
  setInterval(fetchAndDisplayData, 10000); // تحديث كل 10 ثواني
});
