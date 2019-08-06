const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    let msg = {
        name: null,
        text: null,
        createdAt: null
    }

    socket.emit('welcome', 'Welcome to ChatApp')

    socket.on('setName', (name) => {
        msg.name = name
        msg.createdAt = new Date().getTime()
        socket.broadcast.emit('join', msg)
    })


    socket.on('sendMsg', (text) => {
        msg.text = text
        msg.createdAt = new Date().getTime()
        io.emit('msg', msg)
    })

    socket.on('sendLocation', (location) => {
        socket.broadcast.emit('location', location)
    })

    socket.on('disconnect', () => {
        if (msg.name) {
            io.emit('leave', msg.name)
        }
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})