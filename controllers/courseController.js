import Course from "../models/Course.js";

// @POST /api/courses
// Create a new course (Admin only)
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      createdBy: req.user.id, // Use _id from token
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @GET /api/courses
// Get all active courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).populate(
      "createdBy",
      "name email"
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @GET /api/courses/:id
// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!course || !course.isActive) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @PUT /api/courses/:id
// Update a course (Admin only)
export const updateCourse = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    if (isActive !== undefined) course.isActive = isActive;

    await course.save();

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @DELETE /api/courses/:id
// Soft delete a course (set isActive to false) (Admin only)
export const deactivateCourse = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isActive = false;
    await course.save();

    res.json({
      message: "Course deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
