import express from "express";
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  updateOrder,
  deleteTrip,
  createTodoForTrip,
  createNoteForTrip,
} from "../controller/tripController";

const router = express.Router();

// Get all trips
router.get("/", getTrips);

// Get a specific trip
router.get("/:id", getTrip);

// Create a new trip
router.post("/", createTrip);

// Update a trip
router.put("/:id", updateTrip);

// Update order for all trips
router.patch("/order", updateOrder);

// Delete a trip
router.delete("/:id", deleteTrip);

// Create a todo and connect it to a specific trip
router.post("/:tripId/todos", createTodoForTrip);

// Create a note and connect it to a specific trip
router.post("/:tripId/notes", createNoteForTrip);

export default router;
