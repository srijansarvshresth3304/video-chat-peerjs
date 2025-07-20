const express = require("express");
const { ExpressPeerServer } = require("peer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
});

// Mount PeerJS server
app.use("/peerjs", peerServer);
