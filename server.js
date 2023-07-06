const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const port = 3000 || process.env.PORT;
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { getCurrentUser, joinUser, userLeaves, getRoomUsers } = require("./utils/users");
const botName = "Hive Bot";
const io = socketio(server);

// MiddleWare to set to Static folder
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', socket => {

    socket.on("joinRoom", ({ username, room }) => {

        const user = joinUser(socket.id, username, room);
        socket.join(user.room);

        // Welcome a newly joined User
        socket.emit("message", formatMessage(botName, "Hello, Welcome to ChatHive!"));

        //  BroadCast when users joins
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} joined the room`));

        // Send UserInfo and roomInfo
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Listen for chat message
    socket.on("chatMessage", (msg) => {
        // console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // When user Disconnects
    socket.on("disconnect", () => {
        const user = userLeaves(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} left the Room !`));

            // Send UserInfo and roomInfo
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
})


server.listen(port, () => {
    console.log(`Server started at port ${port}`);
})