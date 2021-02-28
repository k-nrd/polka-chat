import http from 'http'
import polka from 'polka'
import sirv from 'sirv'
import WebSocket, { OPEN as WebSocketOPEN } from 'ws'
import { events, isIncoming } from './ws'

import type { Channels, Message, ServerCtx, SocketCtx } from './types'

const { PORT = 3000 } = process.env

const files = sirv('public')
const server = http.createServer()

polka({ server }).use(files).listen(PORT, (err: Error) => {
  if (err != null) throw err
  console.log(`> Running on localhost:${PORT}`)
})

const wss = new WebSocket.Server({ server })

const serverCtx: ServerCtx = {
  channels: {
    TEST: [],
    TEST2: [],
  },
}

wss.on('connection', (socket: WebSocket) => {
  const socketCtx: SocketCtx = {
    username: undefined,
    isSubscribed: (channel: keyof Channels): boolean => serverCtx.channels[channel]?.includes(socket),
    subscribe: (channel: keyof Channels): void => {
      if (socketCtx.isSubscribed(channel) || serverCtx.channels[channel] == null) return
      serverCtx.channels[channel] = serverCtx.channels[channel].concat(socket)
    },
    unsubscribe: (channel: keyof Channels): void => {
      serverCtx.channels[channel] = serverCtx.channels[channel].filter((c) => c !== socket)
    },
    broadcast: ({ channel, event, data }: Message<any>): void => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocketOPEN && serverCtx.channels[channel]?.includes(client) && client !== socket) {
          console.log(`Broadcasting data. Channel: ${channel}, event: ${event}, data: ${data as string}`)
          client.send(JSON.stringify({ channel, event, data }))
        }
      })
    },
  }

  socket.on('message', (json: string) => {
    const { channel, event, data } = JSON.parse(json)
    console.log(`Received data. Channel: ${channel}, event: ${event}, data: ${data}.`)
    if (isIncoming(event)) {
      if (socketCtx.isSubscribed(channel) || event === 'addUser') {
        events[event]({ channel, event, data }, socketCtx, serverCtx)
      }
    }
  })
})
