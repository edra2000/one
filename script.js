function drawCircle(retries = 10) {
  const container = document.getElementById(containerId);
  if (container) {
    const percent = Math.max(0.01, Math.min(1, parseFloat(ticker.vol24h) / 100000000));
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
        if (!circle.text) return;
        circle.setText(value + '%');
      }
    });

    circle.text.style.fontFamily = '"Arial", sans-serif';
    circle.text.style.fontSize = '16px';
    circle.text.style.fill = '#f0f8ff';

    circle.animate(percent);
  } else if (retries > 0) {
    // إعادة المحاولة إذا لم يتم العثور على العنصر
    setTimeout(() => drawCircle(retries - 1), 100);
  } else {
    // عرض رسالة خطأ واضحة
    console.error(`❌ العنصر ${containerId} غير موجود في الصفحة بعد محاولات متعددة.`);
  }
}
