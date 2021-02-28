import http from 'http'
import polka from 'polka'
import sirv from 'sirv'
import WebSocket from 'ws'

const { PORT = 3000 } = process.env

const files = sirv('public')
const server = http.createServer()

polka({ server }).use(files).listen(PORT, (err: Error) => {
  if (err != null) throw err
  console.log(`> Running on localhost:${PORT}`)
})

const wss = new WebSocket.Server({ server })

let users = 0

wss.on('connection', (socket) => {
  let added = false
  let username: string

  const broadcast = (type: string, data: object): void => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send({ type, data })
      }
    })
  }

  socket.on('new message', (data: string) => {
    broadcast('new message', { username, message: data })
  })

  socket.on('add user', (data: string) => {
    if (added) return
    username = data
    ++users
    added = true
    broadcast('user joined', { users, username })
  })

  socket.on('typing', (_: any) => {
    broadcast('typing', { username })
  })

  socket.on('stop typing', (_: any) => {
    broadcast('stop typing', { username })
  })

  socket.on('disconnect', (_: any) => {
    if (added) {
      --users
      broadcast('user left', { users, username })
    }
  })
})
