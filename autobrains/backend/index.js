const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const { prepareData, handleWebSocketConnection } = require("./utils");

const app = express();
const server3000 = http.createServer(app);
const server3001 = http.createServer(app);
const wss3000 = new WebSocket.Server({ server: server3000 });
const wss3001 = new WebSocket.Server({ server: server3001 });

// Prepare data for both servers
const dataStandard = prepareData(""); // For standard 2D data
const data3D = prepareData("3D"); // For 3D data

// Handle connections for standard data on port 3000
wss3000.on("connection", (ws) => {
  handleWebSocketConnection(ws, dataStandard);
});

// Handle connections for 3D data on port 3001
wss3001.on("connection", (ws) => {
  handleWebSocketConnection(ws, data3D);
});

app.get("/websocket/health", (req, res) => {
  res.send("WebSocket server is running");
});

// Listen on both ports
server3000.listen(3000, () => {
  console.log(`Standard server running on http://localhost:3000`);
});
server3001.listen(3001, () => {
  console.log(`3D server running on http://localhost:3001`);
});
