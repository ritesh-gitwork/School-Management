import mongoose, { Schema, model } from "mongoose";
import User from "./user.model.js";

const classSchema = new Schema(
  {
    className: {
      type: String,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
