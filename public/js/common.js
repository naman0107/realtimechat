const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.messages')
const currentUser = document.getElementById('current-user')
const roomName = document.getElementById('rooms')
const userList = document.getElementById('users')

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

currentUser.innerHTML = username

const socket = io()


// Join chatroom
socket.emit('joinRoom', { username, room })

//Get rooms and users
socket.on('roomUsers', ({ users, room }) => {
    outputRoomName(room)
    outputUsers(users)
})

// Message from server
socket.on('message', message => {
    outputMessage(message)

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// User connect/disconnect message sent by server
socket.on('userStatus', message => {
    outputStatus(message)
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Get message text
    const msg = e.target.elements.msg.value

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    if (message.username === username) {
        div.innerHTML = `<li class="replies">
                            <span class="user-name" style="float:right">${message.username}</span>
                            <p>${message.text} <span style="text-align:right;font-size:9px; display:block">${message.time}</span></p>
                        </li>`
        document.querySelector('.chat-messages').appendChild(div)
    } else {
        div.innerHTML = `<li class="sent">
                            <span class="user-name" style="float:left; margin-right: 10px;">${message.username}</span>
                            <p>${message.text} <span style="text-align:left;font-size:9px; display:block">${message.time}</span></p>
                        </li>`
        document.querySelector('.chat-messages').appendChild(div)
    }
}

// Output status from DOM
function outputStatus(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<li style="color: slateblue;margin:0px">
                        <p>${message.text}</p>
                        <p>${message.time}</p>
                    </li>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerHTML = `<li class="contact">
                            <div class="wrap">
                                <div class="meta">
                                    <p class="name">${room}</p>
                                </div>
                            </div>
                        </li>`
}

// Add users name to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li class="contact">
                                <div class="wrap">
                                    <div class="meta">
                                        <p class="name">${user.username}</p>
                                    </div>
                                </div>
                            </li>`).join('')}
        `
}