const mongoose = require("mongoose");

const AdminTradeSchema = new mongoose.Schema(
  {
    marketSelect: { type: String, required: true },
    tradeTime: { type: String, required: true },
    leverage: { type: String, required: true },
    amount: { type: Number, required: true },
    profit: { type: Number, required: true },
    createdDate: { type: String, required: true },
    tradeType: { type: String, enum: ["Buy", "Sell"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminTrade", AdminTradeSchema);
