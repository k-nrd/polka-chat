import type { IncomingEventHandlers, OutgoingEvent, Message, ServerCtx, SocketCtx } from './types'

export const events: IncomingEventHandlers = {
  addUser: (msg: Message<string>, socketCtx: SocketCtx) => {
    if (socketCtx.isSubscribed(msg.channel)) return
    // this would overwrite username every time he joined a different channel
    // fix this later
    socketCtx.username = msg.data
    socketCtx.subscribe(msg.channel)
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

export function isIncoming (event: keyof IncomingEventHandlers | OutgoingEvent): event is keyof IncomingEventHandlers {
  return events[event as keyof IncomingEventHandlers] != null
}
