const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const socket = io();
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join ChatRoom
socket.emit("joinRoom", { username, room });

// Get room users and info
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message coming from server
socket.on('message', msg => {
    // console.log(msg);
    outputMessage(msg);

    // Scroll down automatically
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submission of chat form
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = event.target.elements.msg.value;
    // console.log(msg);
    // Emit this message value to server
    socket.emit("chatMessage", msg);

    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
})

// Displaying message to DOM
function outputMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta"> ${msg.userName} <span> ${msg.time} </span> </p>
    <p class="text">
        ${msg.message}
    </p>`

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room Number to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Dispaly Users
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li> ${user.username} </li>`).join("")}`
}

// Leave Room button
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});