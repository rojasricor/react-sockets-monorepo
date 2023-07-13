"use strict";

var _express = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _path = _interopRequireDefault(require("path"));
var _socket = require("socket.io");
var _url = require("url");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket.Server(server);

// Serve static folder frontend
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = _path["default"].dirname(_filename);
app.use(_express["default"]["static"](_path["default"].join(_dirname, "..", "..", "frontend", "dist")));
app.get("*", function (req, res) {
  res.sendFile(_path["default"].join(_dirname, "..", "..", "frontend", "dist", "index.html"));
});

// Socket.
io.on("connection", function (socket) {
  console.log("Client connected with ID:", socket.id);
  socket.on("message", function (body) {
    // Send to other clients
    socket.broadcast.emit("message", {
      body: body,
      from: socket.id.slice(6)
    });
  });
});
server.listen(4000);
console.log("Server running on port", 4000);