document.addEventListener('DOMContentLoaded', async function () {
  const binanceApiUrl = 'https://api.binance.com/api/v3/ticker/24hr';
  const cmcApiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
  const cmcApiKey = 'f360fff5-522f-4ce9-8d02-6598f293f966';

  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  const errorMessage = document.querySelector('.error-message');

  const stableCoins = ['USDT', 'BUSD', 'USDC', 'DAI', 'TUSD', 'FDUSD'];

  function displayError(message) {
    loadingMessage.style.display = 'none';
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  try {
    const [binanceRes, cmcRes] = await Promise.allSettled([
      fetch(binanceApiUrl),
      fetch(cmcApiUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': cmcApiKey
        }
      })
    ]);

    if (binanceRes.status !== 'fulfilled') throw new Error('Binance API failed');

    const binanceData = await binanceRes.value.json();
    const cmcData = cmcRes.status === 'fulfilled' ? await cmcRes.value.json() : { data: [] };

    loadingMessage.style.display = 'none';
    gridContainer.style.display = 'grid';

    const cmcMap = {};
    cmcData.data?.forEach(item => {
      cmcMap[item.symbol] = item.quote.USD.market_cap;
    });

    const filtered = binanceData
      .filter(ticker =>
        /^([A-Z]+)USDT$/.test(ticker.symbol) &&
        !stableCoins.includes(ticker.symbol.replace('USDT', '')) &&
        parseFloat(ticker.quoteVolume) > 0
      );

    filtered.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

    gridContainer.innerHTML = '';

    filtered.slice(0, 40).forEach(ticker => {
      const symbol = ticker.symbol.replace('USDT', '');
      const price = parseFloat(ticker.lastPrice);
      const change = parseFloat(ticker.priceChangePercent);
      const volume = parseFloat(ticker.quoteVolume);
      const marketCap = cmcMap[symbol] || 'N/A';
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
        <div class="market-cap">Market Cap: ${marketCap !== 'N/A' ? `$${marketCap.toLocaleString()}` : 'N/A'}</div>
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

  } catch (err) {
    console.error('خطأ عام:', err);
    displayError('حدث خطأ أثناء تحميل البيانات من Binance أو CoinMarketCap.');
  }
});
