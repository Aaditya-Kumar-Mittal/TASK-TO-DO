import express from "express";
import apiRoute, { apiProtected } from "./routes/api.js";
import mongoose from "mongoose";
import { DB_CONNECT } from "./utils/constants.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import cors from 'cors';

const app = express();

// Connect to MongoDB
mongoose.connect(DB_CONNECT)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const PORT = 8000;

app.use(cors({
    origin: ["http://localhost:3000", "https://task-manager.com"]
}));
// Middleware
app.use(express.json()); // Parses body into JSON

// Routes
app.use('/api/', apiRoute);
app.use('/api/', AuthMiddleware, apiProtected);

// Start the server
app.listen(PORT, () => console.log("Server is running!"));
