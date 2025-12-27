import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deactivateCourse,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/", createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deactivateCourse);

export default router;
