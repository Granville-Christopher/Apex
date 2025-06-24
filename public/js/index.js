const ctx = document.getElementById("portfolioPieChart").getContext("2d");
const portfolioLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Profits", "Loss", "Deposits", "Balance"],
    datasets: [
      {
        label: "Portfolio Overview",
        data: [45, 25, 20, 10],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  },
  options: {
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  },
});
