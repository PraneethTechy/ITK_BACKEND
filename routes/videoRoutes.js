import express from "express";
import {
  createVideo,
  getVideosByCourse,
} from "../controllers/videoController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/", createVideo);
router.get("/course/:courseId", getVideosByCourse);

export default router;
