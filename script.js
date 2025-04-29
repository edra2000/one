function fetchAndDisplayData() {
  fetch('https://api.coincap.io/v2/assets', {
    headers: {
      Authorization: 'Bearer 1c2bc8eff18ba6dc03c21ec4fa89bce6803bcc2d536f8d988841f7a092018f5c'
    }
  })
    .then(response => response.json())
    .then(data => {
      loadingMessage.style.display = 'none';
      gridContainer.style.display = 'grid';

      const coins = data.data
        .filter(asset => parseFloat(asset.volumeUsd24Hr) > 0)
        .slice(0, 30); // عرض أول 30 عملة فقط

      gridContainer.innerHTML = '';

      coins.forEach(asset => {
        const coinId = asset.id.replace(/[^a-zA-Z0-9]/g, '');
        const price = parseFloat(asset.priceUsd);
        const change = parseFloat(asset.changePercent24Hr);
        const volume = parseFloat(asset.volumeUsd24Hr);
        const liquidityPercent = Math.min(1, volume / 100000000);
        const containerId = `liquidity-${coinId}`;

        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
          <div class="symbol">${asset.symbol}</div>
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
      console.error('فشل في جلب البيانات من CoinCap:', error);
      displayError('خطأ في تحميل البيانات.');
    });
}
