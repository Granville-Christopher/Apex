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


function loadChart(symbol) {
  const container = document.getElementById("chartContainer");
  if (!symbol) {
    container.innerHTML = "<span>Select a market to view its chart.</span>";
    return;
  }
  container.innerHTML = `
      <iframe src="https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=60&theme=dark"
        width="100%" height="100%" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
    `;
}
