import express from "express";
import { Server as socket } from "socket.io";
import http from "http";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create Express app instance
const app = express();

// Initialize HTTP server with Express
const server = http.createServer(app);

// Instantiate Socket.io on HTTP server
const io = new socket(server);

// Set public directory for static files
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Staring the server
server.listen(3000, function () {
  console.log("Server listening on port 3000");
});

// Making Open AI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Socket Code
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming messages
  socket.on("message", async (data) => {
    console.log("Message received:", data);

    // const hello = `Bot: You said "${data}""`;
    const prompt = `${data}`;

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      prompt,
    });

    // console.log("Response from OpenAI:", response);
    const reply = response.choices[0].text.trim();
    socket.emit("message", reply);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
