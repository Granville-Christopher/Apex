const mongoose = require("mongoose");
const tradeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    marketSelect: {
        type: String,
        required: false,
    },
    tradeTime: {
        type: String,
        required: false,
    },
    leverage: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createddate: {
        type: String,
        required: false
    },
    tradeType: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false,
        default: 'Open'
    },
    pnl: {
        type: String,
        required: false
    },
    outcome: {
        type: String,
        required: false
    },
    commission: {
        type: String,
        required: false
    },
    limitOrder: {
        type: String,
        required: false
    },
});

// Create and export the User model
const Trade = mongoose.model("Trade", tradeSchema);
module.exports = Trade;
