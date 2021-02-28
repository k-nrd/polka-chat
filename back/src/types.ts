import type WebSocket from 'ws'

export interface IncomingEventHandlers {
  addUser: Function
  newMsg: Function
  typing: Function
  stopTyping: Function
  disconnect: Function
}

export type OutgoingEvent = 'userJoined' | 'userLeft' | 'typing' | 'stopTyping' | 'newMsg'

export interface Channels {
  TEST: WebSocket[]
  TEST2: WebSocket[]
}

export interface Message<T> {
  channel: keyof Channels
  event: keyof IncomingEventHandlers | OutgoingEvent
  data: T
}

export type Broadcast<T> = (msg: Message<T>) => void

export interface ServerCtx {
  channels: Channels
}

export interface SocketCtx {
  username?: string
  isSubscribed: (channel: keyof Channels) => boolean
  subscribe: (channel: keyof Channels) => void
  unsubscribe: (channel: keyof Channels) => void
  broadcast: Broadcast<any>
}
