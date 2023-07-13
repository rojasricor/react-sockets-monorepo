import express from "express";
import http from "http";
import path from "path";
import { Server as SocketServer } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// Serve static folder frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "..", "frontend", "dist", "index.html")
    );
});

// Socket.
io.on("connection", (socket) => {
    console.log("Client connected with ID:", socket.id);

    socket.on("message", (body) => {
        // Send to other clients
        socket.broadcast.emit("message", {
            body,
            from: socket.id.slice(6),
        });
    });
});

server.listen(4000);
console.log("Server running on port", 4000);
