// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const LOCATION_POSTED = "location-posted";
const LOCATION_UPDATED = "location-updated";

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// Serve a basic message at root
app.get("/", (req, res) => {
  res.render("index", {
    apiKey: process.env.GOOGLE_API_KEY,
  });
});
// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on(LOCATION_POSTED, (locationPayload) => {
    console.log("Message received:", locationPayload);
    // Broadcast the message to all other clients
    socket.broadcast.emit(LOCATION_UPDATED, locationPayload);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
