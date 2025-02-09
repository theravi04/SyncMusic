const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"},
});

app.use(cors());
app.use(express.json());

let currentSong = { url: "", time: 0, playing: false};

// when a user connects
io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    // send currect song state to newly connected clients
    socket.emit("sync-music", currentSong);

    socket.on("play-music", (data) =>{
        currentSong = data;
        io.emit("sync-music", currentSong);
    });
    socket.on("pause-music", (data) => {
        currentSong = data;
        io.emit("sync-music", (currentSong));
    });

    socket.on("disconnect", () => console.log("user offline", socket.id))
});

server.listen(5000, () => console.log("server running on 5000"));