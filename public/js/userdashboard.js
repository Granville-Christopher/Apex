document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden");
});

const toggleTheme = document.getElementById("toggleTheme");
toggleTheme.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
});

window.addEventListener("DOMContentLoaded", () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
});

// function loadChart(symbol) {
//   const container = document.getElementById("chartContainer");
//   if (!symbol) {
//     container.innerHTML = "<span>Select a market to view its chart.</span>";
//     return;
//   }
//   container.innerHTML = `
//       <iframe src="https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=60&theme=dark"
//         width="100%" height="100%" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
//     `;
// }

function loadChart(symbol) {
  const container = document.getElementById("chartContainer");

  if (!symbol) {
    container.innerHTML = "<span>Select a market to view its chart.</span>";
    return;
  }

  // Fallbacks for restricted symbols
  // const symbolMap = {
  //   "COMEX:GC1!": "OANDA:XAUUSD", // Gold
  //   "TVC:SILVER": "TVC:SILVER", // Silver (works)
  //   "NYMEX:CL1!": "TVC:USOIL", // Crude Oil
  //   "NYMEX:NG1!": "CAPITALCOM:NATURALGAS", // Natural Gas
  //   "ICEUSA:SB1!": "TVC:SUGAR", // Sugar (less common — fallback ETF needed)
  //   "NYMEX:RB1!": "CAPITALCOM:GASOLINE", // Gasoline
  //   "BINANCE:BTCUSDT": "BINANCE:BTCUSDT", // Bitcoin
  //   "BINANCE:ETHUSDT": "BINANCE:ETHUSDT", // Ethereum
  //   "TVC:SPX": "TVC:SPX", // S&P 500 Index
  // };
  const symbolMap = {
    "COMEX:GC1!": "OANDA:XAUUSD", // Gold
    "TVC:SILVER": "TVC:SILVER", // Silver
    "NYMEX:CL1!": "TVC:USOIL", // Crude Oil
    "NYMEX:NG1!": "CAPITALCOM:NATURALGAS", // Natural Gas
    "ICEUSA:SB1!": "LSE:SUCR",
    "NYMEX:RB1!": "CAPITALCOM:GASOLINE", // Gasoline
    "BINANCE:BTCUSDT": "BINANCE:BTCUSDT", // Bitcoin
    "BINANCE:ETHUSDT": "BINANCE:ETHUSDT", // Ethereum
    "TVC:SPX": "AMEX:SPY", // S&P 500 via SPY ETF
  };

  const fallbackSymbol = symbolMap[symbol] || symbol;

  const containerId = `tradingview_${fallbackSymbol
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()}`;

  if (symbol === "ICEUSA:SB1!") {
    container.innerHTML =
      "<span class='text-yellow-400'>Sugar chart not available.</span>";
    return;
  }
  container.innerHTML = `
      <div class="bg-gray-800 rounded shadow overflow-hidden w-full h-full">
        <div id="${containerId}" class="h-full"></div>
      </div>
    `;

  new TradingView.widget({
    width: "100%",
    height: 380,
    symbol: fallbackSymbol,
    interval: "15",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    hide_top_toolbar: false,
    save_image: false,
    container_id: containerId,
  });
}
