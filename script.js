const circle = new ProgressBar.Circle(container, {
  color: '#00ff88',
  trailColor: '#444',
  trailWidth: 2,
  duration: 1400,
  easing: 'easeInOut',
  strokeWidth: 6,
  text: {
    value: '',
    className: 'progress-text',
    style: {
      color: '#f0f8ff',
      position: 'absolute',
      left: '50%',
      top: '50%',
      padding: 0,
      margin: 0,
      transform: {
        prefix: true,
        value: 'translate(-50%, -50%)'
      },
      fontSize: '14px'
    }
  },
  from: { color: '#00ff88' },
  to: { color: '#ff3c3c' },
  step: (state, circle) => {
    circle.path.setAttribute('stroke', state.color);
    const val = Math.round(circle.value() * 100);
    circle.setText(val + '%');
  }
});
