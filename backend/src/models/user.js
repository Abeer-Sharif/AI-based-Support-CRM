const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "agent"],
            default: "agent"
        },

        team: {
            type: String,
            enum: ["Billing", "Technical", "Account", "General","Shipping","Product"],
            default: "General"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);