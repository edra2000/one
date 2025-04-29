document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://www.okx.com/api/v5/market/tickers?instType=SPOT&quoteCcy=USDT';
  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  const errorMessage = document.querySelector('.error-message');
  const stableCoins = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'PAX'];

  function displayError(message) {
    loadingMessage.style.display = 'none';
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function fetchAndDisplayData() {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        loadingMessage.style.display = 'none';
        gridContainer.style.display = 'grid';

        const filteredCoins = data.data.filter(ticker => {
          const [base, quote] = ticker.instId.split('-');
          return quote === 'USDT' && !stableCoins.includes(base);
        });

        filteredCoins.sort((a, b) => parseFloat(b.vol24h) - parseFloat(a.vol24h));
        gridContainer.innerHTML = '';

        filteredCoins.slice(0, 30).forEach(ticker => {
          const changeValue = parseFloat(ticker.change24h);
          const volume = parseFloat(ticker.vol24h);
          const price = parseFloat(ticker.last);
          const percent = Math.min(1, volume / 100000000);
          const coinId = ticker.instId.replace(/[^a-zA-Z0-9]/g, '');
          const containerId = `liquidity-${coinId}`;

          const card = document.createElement('div');
          card.className = 'crypto-card';
          card.innerHTML = `
            <div class="symbol">${ticker.instId.split('-')[0]}</div>
            <div class="price">${price.toFixed(2)} USD</div>
            <div class="change ${changeValue >= 0 ? 'positive' : 'negative'}">
              ${changeValue.toFixed(2)}%
            </div>
            <div class="liquidity-chart" id="${containerId}"></div>
            <div class="volume">Vol: ${volume.toLocaleString()}</div>
          `;

          gridContainer.appendChild(card);

          function drawCircle(retries = 10) {
            const container = document.getElementById(containerId);
            if (container) {
              const circle = new ProgressBar.Circle(container, {
                color: '#00ff88',
                trailColor: '#444',
                trailWidth: 2,
                duration: 1400,
                easing: 'easeInOut',
                strokeWidth: 6,
                text: {
                  autoStyleContainer: false
                },
                from: { color: '#00ff88' },
                to: { color: '#ff3c3c' },
                step: function (state, circle) {
                  circle.path.setAttribute('stroke', state.color);
                  const value = Math.round(circle.value() * 100);
                  circle.setText(value + '%');
                }
              });

              circle.text.style.fontFamily = '"Arial", sans-serif';
              circle.text.style.fontSize = '16px';
              circle.text.style.fill = '#f0f8ff';

              circle.animate(percent);
            } else if (retries > 0) {
              setTimeout(() => drawCircle(retries - 1), 100);
            }
          }

          drawCircle();
        });
      })
      .catch(error => {
        console.error('حدث خطأ أثناء الاتصال بـ OKX API:', error);
        displayError("حدث خطأ أثناء جلب بيانات الأسعار من OKX.");
      });
  }

  fetchAndDisplayData();
  setInterval(fetchAndDisplayData, 10000); // تحديث كل 10 ثواني
});
