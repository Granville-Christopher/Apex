const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    walletname: {
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
    }
});

// Create and export the User model
const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
