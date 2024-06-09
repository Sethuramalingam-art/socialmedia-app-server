import express from "express";

import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ API's
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE for API's
router.patch("/:id/like", verifyToken, likePost);

export default router;
