import mongoose, { Schema } from "mongoose";
import { INote } from "../interfaces/INote";

const SNote: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    links: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INote>("Note", SNote, "my_notes");
