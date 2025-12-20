import mongoose, { Schema } from "mongoose";
import { ITrip } from "../interfaces/ITrip";

const STrip: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITrip>("Trip", STrip, "my_trips");
