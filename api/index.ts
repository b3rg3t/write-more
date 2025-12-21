import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import notesRouter from "./src/routes/notes";
import todosRouter from "./src/routes/todos";
import tripsRouter from "./src/routes/trips";
import usersRouter from "./src/routes/users";
import authRouter from "./src/routes/auth";

// Load environment variables from config.env
dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.ATLAS_URI || "";

// Middleware
app.use(express.json());

// Connect to MongoDB with retry
const connectWithRetry = async (
  uri: string,
  retries: number = 5,
  delay: number = 1000
) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {});
      console.log("Connected to MongoDB");
      return;
    } catch (err) {
      console.error(
        `Failed to connect to MongoDB (attempt ${i + 1}/${retries}):`,
        err
      );
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to connect to MongoDB after all retries");
};

(async () => {
  try {
    await connectWithRetry(MONGO_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB after retries:", err);
    process.exit(1);
  }

  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Graceful shutdown function
  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    try {
      await mongoose.connection.close();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  };

  // Handle process signals
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    gracefulShutdown("uncaughtException");
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    gracefulShutdown("unhandledRejection");
  });
})();

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/todos", todosRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/users", usersRouter);

export default app;
