import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { EUserRole } from "../enums/EUserRole";

const SUser: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(EUserRole),
      default: EUserRole.GUEST,
    },
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", SUser, "users");
