const mongoose = require("mongoose");

const KycVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  verificationType: {
    type: String,
    enum: ["id_card", "drivers_license"],
    required: true
  },
  cardFront: {
    type: String,
    required: true
  },
  cardBack: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("KycVerification", KycVerificationSchema);
