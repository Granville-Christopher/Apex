document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("kycVerificationForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = document.getElementById("kycVerificationForm");
      const formData = new FormData(form);

      try {
        const response = await fetch("/verification/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          showAlert(
            data.message ||
              "KYC submitted successfully! Your details are under review, we'll get back to you shortly with a response.",
            "success"
          );
        } else {
          showAlert(data.error || "KYC submission failed", "error");
        }
      } catch (err) {
        showAlert("An error occurred while submitting the form.", "error");
      }
    });
});
