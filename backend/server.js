import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import teamRoutes from "./routes/team.js";
import inviteRoutes from "./routes/invite.js";
import inboxRoutes from "./routes/inbox.js";
import issueRoutes from "./routes/issue.js";
import projectRoutes from "./routes/project.js";
import activityRoutes from "./routes/activity.js";
import searchRoutes from "./routes/search.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store io instance on app for use in routes
app.set("io", io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join team room for real-time updates
  socket.on("join_team", (teamId) => {
    socket.join(`team_${teamId}`);
    console.log(`Socket ${socket.id} joined team_${teamId}`);
  });

  // Join issue room for specific issue updates
  socket.on("join_issue", (issueId) => {
    socket.join(`issue_${issueId}`);
    console.log(`Socket ${socket.id} joined issue_${issueId}`);
  });

  // Leave team room
  socket.on("leave_team", (teamId) => {
    socket.leave(`team_${teamId}`);
    console.log(`Socket ${socket.id} left team_${teamId}`);
  });

  // Leave issue room
  socket.on("leave_issue", (issueId) => {
    socket.leave(`issue_${issueId}`);
    console.log(`Socket ${socket.id} left issue_${issueId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// More permissive CORS for debugging
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/inbox", inboxRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
