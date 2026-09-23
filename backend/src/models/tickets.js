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
            enum: ["Billing", "Technical", "Account", "Shipping", "Product", "Other"],
            default: "Other"
        },
        team: {
            type: String,
            enum: [
                "Billing",
                "Technical",
                "Account",
                "General",
                "Shipping",
                "Product",
            ],
            default: "General"
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default:"Medium"
        },

        sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"],
            default:"Neutral"
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
