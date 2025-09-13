const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  reviewText: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
