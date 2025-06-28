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

  const response = await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    showAlert(data.message || "Login successful!", "success");
    window.location.href = "/otp";
  } else {
    showAlert(data.error || "Login failed", "error");

    if (data.redirect) {
      setTimeout(() => {
        window.location.href = data.redirect;
      }, data.delay || 5000);
    }
  }
});
