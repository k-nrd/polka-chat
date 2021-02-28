import http from 'http'
import polka from 'polka'
import sirv from 'sirv'
import WebSocket from 'ws'

const { PORT = 3000 } = process.env

const files = sirv('public')
const server = http.createServer()
export const wss = new WebSocket.Server({ server })

polka({ server }).use(files).listen(PORT, (err: Error) => {
  if (err != null) throw err
  console.log(`> Running on localhost:${PORT}`)
})
