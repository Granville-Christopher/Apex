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

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password ) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    const signupData = {
      email,
      password,
    };

    localStorage.setItem("AdminEmail", signupData.email);

    console.log("Signup Data:", signupData);

    fetch("/admin/admin-signup", {
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
          window.location.href = "/admin/login";
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
