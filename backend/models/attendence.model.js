import mongoose, { Schema, model } from "mongoose";

const attendenceShema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  studenId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
});

const Attendence = mongoose.model("Attendence", attendenceShema);

export default Attendence;
