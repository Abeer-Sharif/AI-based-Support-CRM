const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            ref: "Ticket",
            required: true
        },

        noteText: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

module.exports = mongoose.model("Note", noteSchema);