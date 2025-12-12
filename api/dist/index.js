"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const notes_1 = __importDefault(require("./src/routes/notes"));
// Load environment variables from config.env
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.ATLAS_URI || "";
// Middleware
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default
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
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// // Notes routes
app.use("/api/notes", notes_1.default);
// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Graceful shutdown function
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    try {
        await mongoose_1.default.connection.close();
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    }
    catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};
// Handle process signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
