  const ctx = document.getElementById('portfolioPieChart').getContext('2d');
  const portfolioPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 99, 132, 0.8)'
            ],
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
        }],
        labels: ['Profits','loss','deposits','balance'], 
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        }
      }
    }
  });