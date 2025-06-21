function togglePassword(fieldId, icon) {
  const input = document.getElementById(fieldId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icon.textContent = isPassword ? "🙈" : "👁️";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const response = await fetch("/admin/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    showAlert(data.message || "Login successful!", "success");
    window.location.href = "/admin";
  } else {
    showAlert(data.error || "Login failed", "error");
  }
});
