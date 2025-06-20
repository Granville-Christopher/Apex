document.getElementById("otp-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const otp = document.getElementById("otp").value.trim();
  const email = localStorage.getItem("userEmail"); // get saved email

  if (!email) {
    showAlert("Session expired. Please sign up again.", "error");
    return;
  }

  const response = await fetch("/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (response.ok) {
    showAlert("OTP Verified! Redirecting to dashboard...", "success");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  } else {
    showAlert(data.error || "OTP verification failed.", "error");
  }
});

document.getElementById("resend-btn").addEventListener("click", async () => {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    showAlert("Session expired. Please sign up again.", "error");
    return;
  }

  const response = await fetch("/resend-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (response.ok) {
    showAlert(data.message, "success");
  } else {
    showAlert(data.error || "Failed to resend OTP.", "error");
  }
});
