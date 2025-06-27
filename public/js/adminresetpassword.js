function togglePassword(fieldId, icon) {
  const input = document.getElementById(fieldId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icon.textContent = isPassword ? "🙈" : "👁️";
}

document.getElementById("getOtpForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgot-email").value.trim();
  if (!email) {
    showAlert("Please enter a valid email address.");
    return;
  }

  const response = await fetch("/admin/get-reset-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (response.ok) {
    showAlert(data.message || "OTP sent to your email.");
  } else {
    showAlert(data.error || "Failed to send OTP.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("reset-email").value.trim();
      const otp = document.getElementById("otp").value.trim();
      const newPassword = document.getElementById("new-password").value;
      const confirmNewPassword = document.getElementById(
        "confirm-new-password"
      ).value;

      if (!email || !otp || !newPassword || !confirmNewPassword) {
        showAlert("All fields are required.");
        return;
      }

      if (newPassword.length < 6) {
        showAlert("Password must be at least 6 characters.");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        showAlert("Passwords do not match.");
        return;
      }

      const response = await fetch("/admin/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword, confirmNewPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(data.message || "Password reset successful!");
        window.location.href = "/admin/login";
      } else {
        showAlert(data.error || "Password reset failed.");
      }
    });
});
