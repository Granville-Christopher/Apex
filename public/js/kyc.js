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
        console.log("Response status:", response.status);
        const data = await response.json();

        if (response.ok) {
          showAlert(
            data.message ||
              "KYC submitted successfully! Your details are under review, we'll get back to you within 24 hours with a response.... If our email isn’t in your inbox, check your or Junk folder and mark it as “Not Spam” to ensure you receive future updates from us.",
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
