import express from "express";

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/user.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ API's
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE for API's
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
