import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import groupRoutes from "./routes/group.js";
import cors from "cors";
import { app, server } from "./config/socket.js";
dotenv.config();
connectDB();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", chatRoutes)
app.use("/api/v1/group", groupRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
