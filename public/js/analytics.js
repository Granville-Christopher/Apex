const ctx = document.getElementById('performanceChart').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)');   // green for gains
  gradient.addColorStop(1, 'rgba(220, 38, 38, 0.1)');   // red for losses

  const performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // You can replace with actual dates
      datasets: [{
        label: 'Performance',
        data: [10000, 10500, 9700, 9900, 10200, 9600, 10100],
        fill: true,
        backgroundColor: gradient,
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: context => `$${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: 'white' },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: 'white',
            callback: value => `$${value}`
          },
          grid: {
            color: 'rgba(255,255,255,0.05)'
          }
        }
      }
    }
  });