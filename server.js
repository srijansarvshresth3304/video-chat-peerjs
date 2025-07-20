const express = require("express");
const { ExpressPeerServer } = require("peer");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

// Setup PeerJS server
const server = require("http").createServer(app);
const peerServer = ExpressPeerServer(server, {
  path: "/peerjs",
  debug: true,
});
app.use("/peerjs", peerServer);

// For "Cannot GET /" issue
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
