import express from "express";
import {
  createGroupChat,
  addToGroup,
  removeFromGroup,
  leaveGroup,
  renameGroup,
  getGroupDetails,
} from "../controllers/group.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// 🆕 Create group
router.post("/create", isAuth, createGroupChat);

// ➕ Add member
router.post("/add", isAuth, addToGroup);

// ➖ Remove member
router.post("/remove", isAuth, removeFromGroup);

// 🚪 Leave group
router.post("/leave", isAuth, leaveGroup);

// ✏️ Rename group
router.post("/rename", isAuth, renameGroup);

// 👥 Get group details
router.get("/:chatId", isAuth, getGroupDetails);

export default router;