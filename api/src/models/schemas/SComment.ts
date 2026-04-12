import mongoose, { Schema } from "mongoose";
import { IComment } from "../interfaces/IComment";

const SComment: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IComment>("Comment", SComment, "my_comments");
