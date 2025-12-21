import { Request, Response } from "express";
import SUser from "../models/schemas/SUser";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await SUser.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await SUser.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, role, firstName, lastName, avatarUrl } =
    req.body;
  try {
    const user = new SUser({
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      avatarUrl,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const { username, email, password, role, firstName, lastName, avatarUrl } =
    req.body;
  try {
    const user = await SUser.findByIdAndUpdate(
      req.params.id,
      { username, email, password, role, firstName, lastName, avatarUrl },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await SUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
