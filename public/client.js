const socket = io()

var username = null

socket.on('welcome', (msg) => {
    let chats = document.getElementById('chats')
    chats.innerHTML +=
        "<div class=\"card mt-1\">" +
            "<div class=\"card-body p-1 pl-3\">" +
                "<b>" + msg + "</b>"
            "</div>" +
        "</div>"
})

socket.on('msg', (msg) => {
    let chats = document.getElementById('chats')
    chats.innerHTML +=
        "<div class=\"card mt-1\">" +
            "<div class=\"card-body p-1 pl-3\">" +
                "<b>" + msg.name + ": </b>" + msg.text +
                "<span style=\"float: right;font-size: 14px\"><i>" + moment(msg.createdAt).fromNow() + "&nbsp;</i></span>" +
            "</div>" +
        "</div>"
})

socket.on('location', (location) => {
    let chats = document.getElementById('chats')
    chats.innerHTML +=
        "<div id=\"" + location.username + "\" class=\"card mt-1\">" +
            "<div class=\"card-body text-primary p-1 pl-3\">" +
                "<b>" + location.username + "</b> has sent his " +
                "<a href=\"https://google.com/maps?q=" + location.latitude + "," + location.longitude + "\" target=\"_blank\">" +
                    "<b>location</b>" + 
                "</a><br>" +
                "<div class=\"progress my-2\">" +
                    "<div id=\"" + location.username + "_progress\" class=\"progress-bar progress-bar-striped progress-bar-animated\"" +
                    "role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\"" +
                    "aria-valuemax=\"100\" style=\"width: 100%\"></div>" +
                "</div>" +
            "</div>" +
            
        "</div>"
    var max = 100;
    setInterval(function(){
        let progress = document.getElementById(location.username + "_progress")
        if (progress) {
            max = max-0.2
            progress.setAttribute('aria-valuenow', max)
            progress.style.width = max + '%'
        } else {
            return false
        }
    }, 10);
    setTimeout(() => {
        document.getElementById(location.username).remove()
    }, 5000)
})

socket.on('join', (msg) => {
    let chats = document.getElementById('chats')
    chats.innerHTML +=
        "<div class=\"card mt-1\">" +
            "<div class=\"card-body text-success p-1 pl-3\">" +
                "<b>" + msg.name + "</b> has joined the chat" +
                "<span style=\"float: right;font-size: 14px\"><i>" + moment(msg.createdAt).fromNow() + "&nbsp;</i></span>" +
            "</div>" +
        "</div>"
})

socket.on('leave', (name) => {
    let chats = document.getElementById('chats')
    chats.innerHTML +=
        "<div class=\"card mt-1\">" +
            "<div class=\"card-body text-danger p-1 pl-3\">" +
                "<b>" + name + "</b> has leaved the chat" +
            "</div>" +
        "</div>"
})

function setName() {
    let name = document.getElementById('name').value
    username = name
    socket.emit('setName', name)
    document.getElementById('name-box').classList.add('d-none')
    document.getElementById('confirm').classList.add('d-none')
    document.getElementById('msg-box').classList.remove('d-none')
    document.getElementById('chat-box').classList.remove('d-none')
    document.getElementById('send').classList.remove('d-none')
    document.getElementById('send-location').classList.remove('d-none')
    document.getElementById('msg').focus()
}

function sendMsg() {
    let msg = document.getElementById('msg').value 
    socket.emit('sendMsg', msg)
    document.getElementById('msg').value = null
    document.getElementById('msg').focus()
}

function sendLocation() {
    if (!navigator.geolocation) {
        return document.getElementById('location-error').classList.remove('d-none')
    }

    navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        socket.emit('sendLocation', {
            latitude,
            longitude,
            username
        })
        let location = document.getElementById('location')
        location.classList.remove('d-none')
        location.innerHTML = 
            "<div class=\"card-body text-success p-1 pl-3\">" +
                "<b> Location sent succesfully </b><br>"
            "</div>"
        setTimeout(() => {
            location.classList.add('d-none')
        }, 3000)
    })
}