import express from "express";
import { Server as socket } from "socket.io";
import http from "http";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

// Create Express app instance
const app = express();

// Initialize HTTP server with Express
const server = http.createServer(app);

// Instantiate Socket.io on HTTP server
const io = new socket(server);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Get the retriever instance
import { getRetriever } from "./retriever.js";
const retriever = await getRetriever();

// Socket Code
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming messages
  socket.on("message", async (data) => {
    console.log("Message received:", data);

    // Get the context from the retriever
    const context = await retriever.getRelevantDocuments(data);
    console.log("Context retrieved:", context);

    // const hello = `Bot: You said "${data}""`;
    const prompt = `You are a helpful assistant. Use the following context to answer the user's question. If the context does not provide enough information, say u dont know the answer. Dont make up answers. Dont share the context with the user. Don't say anything about the context. Just answer the question. answer the question based on the context provided in detail and in a friendly manner.
    Context: ${context.map((doc) => doc.pageContent).join("\n\n")}
    Context metadata: ${context.map((doc) => JSON.stringify(doc.metadata)).join("\n\n")}
    User's Question : ${data}
    Also include the source of the answer in the response. Just refer the source for more information. Just share the blog link. For example: "For more information, visit: [blog link]".`;

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
