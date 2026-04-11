import mongoose, { Schema } from "mongoose";
import { ITodo } from "../interfaces/ITodo";

const STodo: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITodo>("Todo", STodo, "my_todos");
