const express = require('express')
const { createServer } = require('http')
const socket = require('socket.io')

const app = express()
const server = createServer(app)
const io = socket(server)

const MESSAGES_CACHE = []

const GET_PREVIOUS_MESSAGES = 'GET_PREVIOUS_MESSAGES'
const CURRENT_MESSAGES = 'CURRENT_MESSAGES'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', s => {
  console.log('A User connected')
  io.emit(CURRENT_MESSAGES, MESSAGES_CACHE)
  s.on('chat message', message => {
    console.log(message)
    MESSAGES_CACHE.push(message)
    io.emit('chat message', message)
  })

  s.on(GET_PREVIOUS_MESSAGES, () => {
    console.log('inside previous messages')
    io.emit(CURRENT_MESSAGES, MESSAGES_CACHE)
  })
})

server.listen(1234, () => {
  console.log('listening on port 1234')
})
