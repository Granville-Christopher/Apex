const { body, validationResult } = require("express-validator");
const sanitizer = require("express-sanitizer");
const Review = require("../models/usermodel/review");

const validateAndSanitizeReview = [
  body("reviewerName")
    .not()
    .isEmpty()
    .withMessage("Reviewer name is required.")
    .isLength({ min: 2 })
    .withMessage("Reviewer name must be at least 2 characters long.")
    .trim()
    .escape(),

  body("reviewText")
    .not()
    .isEmpty()
    .withMessage("Review text is required.")
    .isLength({ min: 10 })
    .withMessage("Review must be at least 10 characters long.")
    .trim()
    .escape(),
];

const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const newReview = new Review({
      reviewerName: req.body.reviewerName,
      reviewText: req.body.reviewText,
      timestamp: new Date(),
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      message: "Review submitted successfully!",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error saving review:", error);
    // Send only error message string
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateAndSanitizeReview,
  createReview,
};
