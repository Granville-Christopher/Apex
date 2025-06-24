const mongoose = require("mongoose");
const depositSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        required: true
    },
    waddress: {
        type: String,
        required: true
    },
    subData: {
        type: String,
        required: false
    }
});

// Create and export the User model
const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
