import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

joinRequestSchema.index(
  { classId: 1, studentId: 1 },
  { unique: true }
);

export default mongoose.model("JoinRequest", joinRequestSchema);
