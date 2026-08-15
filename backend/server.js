if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ticketRoutes = require("./src/routes/ticket.js");
const authRoutes = require("./src/routes/auth.js");
const dbUrl = process.env.DB_URL;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/tickets", ticketRoutes);
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Support CRM API is running"
    });
});

const PORT = 5001;

async function startServer() {
    try {
        await mongoose.connect(dbUrl);

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
}

startServer();