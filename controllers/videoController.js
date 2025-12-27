import Video from "../models/Video.js";
import Course from "../models/Course.js";

// @POST /api/videos
// Create a new video (Admin only)
export const createVideo = async (req, res) => {
  try {
    const { courseId, title, youtubeUrl, order, isActive } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ message: "Course not found or inactive" });
    }

    // Create video
    const video = await Video.create({
      courseId,
      title,
      youtubeUrl,
      order,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      message: "Video created successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @GET /api/videos/course/:courseId
// Get videos for a course (Authenticated users)
export const getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate course exists and is active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ message: "Course not found or inactive" });
    }

    // Get active videos, sorted by order
    const videos = await Video.find({ courseId, isActive: true }).sort({
      order: 1,
    });

    res.json({
      course: {
        courseId: course.courseId,
        title: course.title,
        description: course.description,
      },
      videos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
