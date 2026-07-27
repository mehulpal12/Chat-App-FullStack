import { Chat } from "../models/Chat.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import mongoose from "mongoose";
import { io } from "../config/socket.js";

/**
 * Helper to safely compare Mongoose ObjectIDs or Strings
 */
const isSameId = (id1: any, id2: any): boolean => {
  if (!id1 || !id2) return false;
  return id1.toString() === id2.toString();
};

// 🆕 Create Group
export const createGroupChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, users } = req.body;
    const currentUser = req.user?._id;

    if (!currentUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name || !users || !Array.isArray(users) || users.length < 2) {
      return res.status(400).json({ message: "Minimum 3 users required (including you)" });
    }

    // Use Set to ensure the admin (currentUser) isn't duplicated in the users array
    const uniqueUserIds = Array.from(
      new Set([...users, currentUser.toString()])
    );

    const chat = await Chat.create({
      isGroup: true,
      name,
      admin: currentUser,
      users: uniqueUserIds,
    });

    return res.status(201).json(chat);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const addToGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    const currentUserId = req.user?._id;

    if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chatId" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Type-safe comparison using helper
    if (!isSameId(chat.admin, currentUserId)) {
      return res.status(403).json({ message: "Only admin can add users" });
    }

    // Check if user already exists in the array
    const userExists = chat.users.some((id: any) => isSameId(id, userId));
    if (userExists) {
      return res.status(400).json({ message: "User already in group" });
    }

    chat.users.push(userId);
    await chat.save();

    io.to(chatId).emit("groupUpdated", chat);

    return res.json(chat);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const removeFromGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    const currentUserId = req.user?._id;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!isSameId(chat.admin, currentUserId)) {
      return res.status(403).json({ message: "Only admin can remove users" });
    }

    // Use type assertion to handle the filter on Mongoose Array
    (chat.users as any) = chat.users.filter(
      (id: any) => !isSameId(id, userId)
    );

    await chat.save();

    io.to(chatId).emit("groupUpdated", chat);

    return res.json(chat);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId } = req.body;
    const currentUserId = req.user?._id;

    if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Filter out the person leaving
    (chat.users as any) = chat.users.filter(
      (id: any) => !isSameId(id, currentUserId)
    );

    // If admin is leaving, transfer ownership to the next person
    if (isSameId(chat.admin, currentUserId) && chat.users.length > 0) {
      chat.admin = new mongoose.Types.ObjectId(chat.users[0] as string);
    }

    // Clean up if group becomes empty
    if (chat.users.length === 0) {
      await Chat.findByIdAndDelete(chatId);
      return res.json({ message: "Group deleted" });
    }

    await chat.save();

    io.to(chatId).emit("groupUpdated", chat);

    return res.json(chat);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const renameGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, name } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    chat.name = name;
    await chat.save();

    io.to(chatId).emit("groupUpdated", chat);

    return res.json(chat);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getGroupDetails = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).select(
      "name users admin isGroup"
    );

    if (!chat) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.json(chat);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};