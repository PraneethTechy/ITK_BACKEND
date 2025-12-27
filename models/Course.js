import mongoose from "mongoose";
import Counter from "./Counter.js";

const courseSchema = new mongoose.Schema(
  {
    courseId: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// AUTO-INCREMENT
courseSchema.pre("save", async function () {
  if (!this.isNew) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "courseId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.courseId = counter.seq;
});

export default mongoose.model("Course", courseSchema);
