import mongoose, { Schema, model } from "mongoose";

const attendenceShema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
  date: {
      type: Date,
      default: Date.now,
    },
},
{timestamps:true});

const Attendence = mongoose.model("Attendence", attendenceShema);

export default Attendence;
