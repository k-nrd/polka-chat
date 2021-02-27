import http from 'http'
import polka from 'polka'
import { Server } from 'socket.io'
import sirv from 'sirv'
import type { Socket } from 'socket.io'

const { PORT = 3000 } = process.env

const files = sirv('public')
const server = http.createServer()

polka({ server }).use(files).listen(PORT, (err: Error) => {
  if (err != null) throw err
  console.log(`> Running on localhost:${PORT}`)
})

const io = new Server(server)

let users = 0

io.on('connection', (socket: Socket) => {
  let added = false
  let username: string

  socket.on('new message', (data: string) => {
    socket.broadcast.emit('new message', {
      username,
      message: data,
    })
  })

  socket.on('add user', (data: string) => {
    if (added) return
    username = data
    ++users
    added = true
    socket.emit('login', { users })
    socket.broadcast.emit('user joined', { users, username })
  })

  socket.on('typing', (_: any) => {
    socket.broadcast.emit('typing', { username })
  })

  socket.on('stop typing', (_: any) => {
    socket.broadcast.emit('stop typing', { username })
  })

  socket.on('disconnect', (_: any) => {
    if (added) {
      --users
      socket.broadcast.emit('user left', { users, username })
    }
  })
})
