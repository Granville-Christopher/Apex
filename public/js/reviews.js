document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("reviewForm");

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const reviewerNameInput = document.getElementById("reviewerName");
      const reviewTextInput = document.getElementById("reviewText");
      const submitButton = reviewForm.querySelector('button[type="submit"]');

      const formData = {
        reviewerName: reviewerNameInput.value,
        reviewText: reviewTextInput.value,

        timestamp: new Date().toISOString(),
      };

      const apiEndpoint = "/submit-review";

      submitButton.textContent = "Submitting...";
      submitButton.disabled = true;

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Success:", result);

          alert(
            "Thank you for your review! It has been submitted successfully."
          );
          reviewForm.reset();
        } else {
          const errorResponse = await response.json();
          console.error(
            "Submission failed:",
            response.status,
            errorResponse.message
          );
          alert(errorResponse.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "An error occurred. Please check your network connection and try again."
        );
      } finally {
        submitButton.textContent = "Submit Review";
        submitButton.disabled = false;
      }
    });
  } else {
    console.error("The form with ID 'reviewForm' was not found on the page.");
  }
});
