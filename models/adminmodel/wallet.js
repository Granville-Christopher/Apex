const mongoose = require("mongoose");
const adminWalletSchema = new mongoose.Schema({
    walletName: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    walletQRCode: {
        type: String,
        required: false
    }
})

// Create and export the User model
const AdminWallet = mongoose.model("AdminWallet", adminWalletSchema);
module.exports = AdminWallet;