const { log } = require("console");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000 || process.env.port;

//incoming connections
io.on("connection", (socket) => {
    console.log("User connected successfully");

    //evnt listener for offer msg
    socket.on("offer", (data) => {
        socket.broadcast.emit("newOffer", data);
    });
    
    //event listener for answer msg
    socket.on("answer", (data) => {
        socket.broadcast.emit("answer", data);
    });

    //event listener for iceCandidate
    socket.on("icecandidate", (data) => {
        socket.broadcast.emit("icecandidate", data);
    });

    //event listener whenever a user disconnects
    socket.io("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});