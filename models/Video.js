import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true }, // Store the original YouTube URL or videoId
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for efficient querying
videoSchema.index({ courseId: 1, order: 1 });

export default mongoose.model("Video", videoSchema);
