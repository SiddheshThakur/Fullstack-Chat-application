import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { initializeSocket } from "./lib/socket.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.FRONTEND_URL || "https://your-app-name.onrender.com"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../Frontend/dist");
  console.log("Frontend path:", frontendPath);
  console.log("Current directory:", __dirname);
  
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    console.log("Serving index.html from:", indexPath);
    res.sendFile(indexPath);
  });
}

const server = app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

// Initialize socket.io
initializeSocket(server);