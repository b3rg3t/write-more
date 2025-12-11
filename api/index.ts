import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

import notesRouter from "./routes/notes.ts";

// Load environment variables from config.env
dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.ATLAS_URI || "";

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// // Notes routes
app.use("/api/notes", notesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
