const mongoose = require("mongoose");
const tradeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    marketSelect: {
        type: Number,
        required: true,
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
        default: 'Pending'
    },
    outcome: {
        type: String,
        required: false
    },
});

// Create and export the User model
const Trade = mongoose.model("Trade", tradeSchema);
module.exports = Trade;
