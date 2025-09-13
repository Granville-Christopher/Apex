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

// document.addEventListener("DOMContentLoaded", async () => {
//   const reviewsDisplay = document.getElementById("reviewsDisplay");

//   if (!reviewsDisplay) {
//     console.error("The element with ID 'reviewsDisplay' was not found.");
//     return;
//   }

//   try {
//     const response = await fetch("/fetch-reviews");
//     if (!response.ok) {
//       throw new Error("Failed to fetch reviews");
//     }

//     const reviews = await response.json();

//     reviewsDisplay.innerHTML = "";

//     if (reviews.length === 0) {
//       reviewsDisplay.innerHTML = `<p class="text-gray-600">No reviews available yet.</p>`;
//       return;
//     }

//     reviews.forEach((review) => {
//       const reviewCard = document.createElement("div");
//       reviewCard.className =
//         "swiper-review bg-white p-6 rounded-lg shadow-lg min-w-[320px] max-w-xs flex-shrink-0";

//       reviewCard.innerHTML = `
//           <h3 class="text-xl font-semibold text-gray-800">
//             ${review.reviewerName || "Anonymous"}
//           </h3>
//           <p class="text-gray-600 mt-2">
//             "${review.reviewText}"
//           </p>
//         `;

//       reviewsDisplay.appendChild(reviewCard);
//     });
//   } catch (error) {
//     console.error("Error loading reviews:", error);
//     reviewsDisplay.innerHTML = `<p class="text-red-500">Unable to load reviews. Please try again later.</p>`;
//   }
// });
