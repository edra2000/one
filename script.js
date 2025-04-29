document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://api.binance.com/api/v3/ticker/24hr';
  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  const errorMessage = document.querySelector('.error-message');

  const stableCoins = ['USDT', 'BUSD', 'USDC', 'DAI', 'TUSD', 'FDUSD'];

  function displayError(message) {
    loadingMessage.style.display = 'none';
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function fetchAndDisplayData() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        loadingMessage.style.display = 'none';
        gridContainer.style.display = 'grid';

        const filtered = data
          .filter(ticker =>
           /^([A-Z]+)USDT$/.test(ticker.symbol) &&
!stableCoins.includes(ticker.symbol.replace('USDT', ''))
 &&
            parseFloat(ticker.quoteVolume) > 0
          );

        filtered.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

        gridContainer.innerHTML = '';

        filtered.slice(0, 40).forEach(ticker => {
          const symbol = ticker.symbol.replace('USDT', '');
          const price = parseFloat(ticker.lastPrice);
          const change = parseFloat(ticker.priceChangePercent);
          const volume = parseFloat(ticker.quoteVolume);
          const liquidityPercent = Math.min(1, volume / 100000000);
          const containerId = `liquidity-${symbol}`;

          const card = document.createElement('div');
          card.className = 'crypto-card';
          card.innerHTML = `
            <div class="symbol">${symbol}</div>
            <div class="price">${price.toFixed(2)} USD</div>
            <div class="change ${change >= 0 ? 'positive' : 'negative'}">
              ${change.toFixed(2)}%
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

              circle.animate(liquidityPercent);
            } else if (retries > 0) {
              setTimeout(() => drawCircle(retries - 1), 100);
            }
          }

          drawCircle();
        });
      })
      .catch(error => {
        console.error('فشل في جلب البيانات من Binance:', error);
        displayError('حدث خطأ أثناء تحميل بيانات Binance.');
      });
