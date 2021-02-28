import WebSocket, { OPEN as WebSocketOPEN } from 'ws'
import { wss } from './index'
import type { IncomingEventHandlers, OutgoingEvent, Channels, Message, ServerCtx, SocketCtx } from './types'

const events: IncomingEventHandlers = {
  addUser: (msg: Message<string>, socketCtx: SocketCtx) => {
    if (socketCtx.isSubscribed(msg.channel)) return
    // this would overwrite username every time he joined a different channel
    // fix this later
    socketCtx.username = msg.data
    socketCtx.broadcast({ channel: msg.channel, event: 'userJoined', data: msg.data })
  },
  typing: (msg: Message<string>, { broadcast }: SocketCtx) => {
    broadcast({ channel: msg.channel, event: 'typing', data: msg.data })
  },
  stopTyping: (msg: Message<string>, { broadcast }: SocketCtx) => {
    broadcast({ channel: msg.channel, event: 'stopTyping', data: msg.data })
  },
  newMsg: (msg: Message<string>, { broadcast }: SocketCtx) => {
    broadcast({ channel: msg.channel, event: 'newMsg', data: msg.data })
  },
  disconnect: (msg: Message<string>, { broadcast, unsubscribe, isSubscribed, username }: SocketCtx, serverCtx: ServerCtx) => {
    if (isSubscribed(msg.channel)) {
      unsubscribe(msg.channel)
      broadcast({ channel: msg.channel, event: 'userLeft', data: { users: serverCtx.channels[msg.channel].length, username: username } })
    }
  },
}

const serverCtx: ServerCtx = {
  channels: {
    TEST: [],
  },
}

function isIncoming (event: keyof IncomingEventHandlers | OutgoingEvent): event is keyof IncomingEventHandlers {
  return events[event as keyof IncomingEventHandlers] != null
}

wss.on('connection', (socket: WebSocket) => {
  const socketCtx: SocketCtx = {
    username: undefined,
    isSubscribed: (channel: keyof Channels): boolean => serverCtx.channels[channel].includes(socket),
    subscribe: (channel: keyof Channels): void => {
      if (socketCtx.isSubscribed(channel)) return
      serverCtx.channels[channel].push(socket)
    },
    unsubscribe: (channel: keyof Channels): void => {
      serverCtx.channels[channel] = serverCtx.channels[channel].filter((c) => c !== socket)
    },
    broadcast: ({ channel, event, data }: Message<any>): void => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocketOPEN && serverCtx.channels[channel].includes(client) && client !== socket) {
          client.send({ channel, event, data })
        }
      })
    },
  }

  socket.on('message', ({ channel, event, data }: Message<any>): void => {
    if (socketCtx.isSubscribed(channel) && isIncoming(event)) {
      events[event]({ channel, event, data }, socketCtx, serverCtx)
    }
  })
})
