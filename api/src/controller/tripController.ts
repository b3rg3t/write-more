import type { Request, Response } from "express";
import { ITrip } from "../models/interfaces/ITrip";
import STrip from "../models/schemas/STrip";
import STodo from "../models/schemas/STodos";
import SNote from "../models/schemas/SNote";

// Get all trips
export const getTrips = async (req: Request, res: Response) => {
  try {
    const trips = await STrip.find().populate("notes").populate("todos");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific trip by ID
export const getTrip = async (req: Request, res: Response) => {
  try {
    const trip = await STrip.findById(req.params.id)
      .populate("notes")
      .populate("todos");
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new trip
export const createTrip = async (req: Request, res: Response) => {
  const { title, description, notes, todos } = req.body;

  try {
    // Find the highest order
    const highestOrderTrip = await STrip.findOne().sort({ order: -1 });
    const newOrder = highestOrderTrip ? highestOrderTrip.order + 1 : 0;

    const newTrip = new STrip({
      title,
      description,
      notes,
      todos,
      order: newOrder,
    });
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a trip
export const updateTrip = async (req: Request, res: Response) => {
  const { title, description, notes, todos } = req.body;

  try {
    const updatedTrip = await STrip.findByIdAndUpdate(
      req.params.id,
      { title, description, notes, todos },
      { new: true }
    )
      .populate("notes")
      .populate("todos");
    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update order for all trips
export const updateOrder = async (req: Request, res: Response) => {
  const updates: Pick<ITrip, "_id" | "order">[] = req.body; // array of { id, order }

  try {
    const promises = updates.map((update) =>
      STrip.findByIdAndUpdate(
        update._id,
        { order: update.order },
        { new: true }
      )
    );
    const updatedTrips = await Promise.all(promises);
    res.json(updatedTrips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a trip
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const deletedTrip = await STrip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a todo and connect it to a trip
export const createTodoForTrip = async (req: Request, res: Response) => {
  const { name, isCompleted } = req.body;
  const tripId = req.params.tripId;

  try {
    // First, create the todo
    const highestOrderTodo = await STodo.findOne().sort({ order: -1 });
    const newOrder = highestOrderTodo ? highestOrderTodo.order + 1 : 0;

    const newTodo = new STodo({ name, isCompleted, order: newOrder });
    const savedTodo = await newTodo.save();

    // Then, connect the todo to the trip
    const updatedTrip = await STrip.findByIdAndUpdate(
      tripId,
      { $push: { todos: savedTodo._id } },
      { new: true }
    )
      .populate("notes")
      .populate("todos");

    if (!updatedTrip) {
      // If trip update fails, we should probably delete the created todo
      await STodo.findByIdAndDelete(savedTodo._id);
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(201).json({
      todo: savedTodo,
      trip: updatedTrip,
      message: "Todo created and connected to trip successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a note and connect it to a trip
export const createNoteForTrip = async (req: Request, res: Response) => {
  const { title, content, links } = req.body;
  const tripId = req.params.tripId;

  try {
    // First, create the note
    const highestOrderNote = await SNote.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new SNote({ title, content, links, order: newOrder });
    const savedNote = await newNote.save();

    // Then, connect the note to the trip
    const updatedTrip = await STrip.findByIdAndUpdate(
      tripId,
      { $push: { notes: savedNote._id } },
      { new: true }
    )
      .populate("notes")
      .populate("todos");

    if (!updatedTrip) {
      // If trip update fails, we should probably delete the created note
      await SNote.findByIdAndDelete(savedNote._id);
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(201).json({
      note: savedNote,
      trip: updatedTrip,
      message: "Note created and connected to trip successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
