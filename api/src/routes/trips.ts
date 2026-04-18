import express from "express";
import {
  getTrips,
  getAllTripsAdmin,
  getTrip,
  createTrip,
  updateTrip,
  updateOrder,
  deleteTrip,
  createTodoForTrip,
  createNoteForTrip,
  addUserToTrip,
  removeUserFromTrip,
  uploadTripImage,
} from "../controller/tripController";
import { getTripImage, getTripImages } from "../controller/imageController";
import { authenticate } from "../middleware/authenticate";
import { uploadTripImageFile } from "../middleware/uploadTripImage";

const router = express.Router();

// Get all trips for authenticated user
router.get("/", authenticate, getTrips);

// Admin endpoint - get all trips
router.get("/admin/all", authenticate, getAllTripsAdmin);

// Get a specific trip
router.get("/:id", authenticate, getTrip);

// Create a new trip
router.post("/", authenticate, createTrip);

// Update a trip
router.put("/:id", authenticate, updateTrip);

// Update order for all trips
router.patch("/order", updateOrder);

// Delete a trip
router.delete("/:id", authenticate, deleteTrip);

// Create a todo and connect it to a specific trip
router.post("/:tripId/todos", authenticate, createTodoForTrip);

// Create a note and connect it to a specific trip
router.post("/:tripId/notes", authenticate, createNoteForTrip);

// Add user to trip
router.post("/:id/users", authenticate, addUserToTrip);

// Remove user from trip
router.delete("/:id/users/:userId", authenticate, removeUserFromTrip);

// Upload image for trip
router.post("/:id/image", authenticate, uploadTripImageFile, uploadTripImage);

// Get all images for trip
router.get("/:id/images", authenticate, getTripImages);

// Get one image file for trip
router.get("/:id/images/:imageId", authenticate, getTripImage);

export default router;
