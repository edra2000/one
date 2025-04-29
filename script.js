// ... (الكود الأصلي حتى filteredCoins)

// احسب أعلى حجم تداول
const maxVol24h = Math.max(...filteredCoins.map(t => parseFloat(t.vol24h)) || 1; // تجنب القسمة على صفر

sortedCoins.forEach(ticker => {
  const changeValue = parseFloat(ticker.change24h) || 0;
  const coinId = ticker.instId.replace(/[^a-zA-Z0-9]/g, '');
  const containerId = `liquidity-${coinId}`;

  const card = document.createElement('div');
  card.className = 'crypto-card';
  card.innerHTML = `
    <div class="symbol">${ticker.instId.split('-')[0]}</div>
    <div class="price">${parseFloat(ticker.last).toFixed(2)} USD</div>
    <div class="change ${changeValue >= 0 ? 'positive' : 'negative'}">
      ${changeValue.toFixed(2)}%
    </div>
    <div class="liquidity-chart" id="${containerId}"></div>
    <div class="volume">Vol: ${parseFloat(ticker.vol24h).toLocaleString()}</div>
  `;
  gridContainer.appendChild(card);

  function drawCircle() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const percent = parseFloat(ticker.vol24h) / maxVol24h;
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
        circle.setText(Math.round(circle.value() * 100) + '%');
      }
    });

    circle.animate(percent);
  }

  drawCircle();
});
