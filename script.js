document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=30&page=1&sparkline=false';
  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  const errorMessage = document.querySelector('.error-message');

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

        gridContainer.innerHTML = '';

        data.forEach(coin => {
          const volume = coin.total_volume;
          const price = coin.current_price;
          const change = coin.price_change_percentage_24h;
          const coinId = coin.id;

          const card = document.createElement('div');
          card.className = 'crypto-card';
          card.innerHTML = `
            <div class="symbol">${coin.name}</div>
            <div class="price">${price.toFixed(2)} USD</div>
            <div class="change ${change >= 0 ? 'positive' : 'negative'}">
              ${change.toFixed(2)}%
            </div>
            <div class="liquidity-chart" id="liquidity-${coinId}"></div>
            <div class="volume">Vol: ${volume.toLocaleString()}</div>
          `;
          gridContainer.appendChild(card);

          // يمكنك إضافة رسم بياني هنا باستخدام مكتبة مناسبة إذا أردت
        });
      })
      .catch(error => {
        console.error('خطأ في جلب البيانات:', error);
        displayError("حدث خطأ أثناء جلب البيانات من CoinGecko.");
      });
  }

  fetchAndDisplayData();
  setInterval(fetchAndDisplayData, 10000);
});
