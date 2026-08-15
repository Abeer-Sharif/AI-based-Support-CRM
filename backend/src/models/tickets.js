const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
            unique: true
        },

        customerName: {
            type: String,
            required: true
        },

        customerEmail: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Closed"],
            default: "Open"
        },

        category: {
            type: String,
            enum: ["Billing", "Technical", "Account", "Shipping", "Product", "Other"]
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"]
        },

        sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"]
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

module.exports = mongoose.model("Ticket", ticketSchema);
