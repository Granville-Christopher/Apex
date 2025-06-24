const mongoose = require("mongoose");
const withdrawSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    waddress: {
        type: String,
        required: true
    },
    createddate: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
});

// Create and export the User model
const Withdraw = mongoose.model("Withdraw", withdrawSchema);
module.exports = Withdraw;
