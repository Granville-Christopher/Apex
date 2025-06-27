function togglePassword(fieldId, icon) {
  const input = document.getElementById(fieldId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icon.textContent = isPassword ? "🙈" : "👁️";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;

    if (!name || !email || !password || !confirmPassword) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match.", "error");
      return;
    }

    const signupData = {
      name,
      email,
      password,
    };

    localStorage.setItem("userEmail", signupData.email);

    console.log("Signup Data:", signupData);

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          showAlert(data.message || "Signup successful!", "success");
          window.location.href = "/kycverification";
        } else {
          showAlert(data.error || "Signup failed.", "error");
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        showAlert("Something went wrong. Please try again.", "error");
      });
  });
});
