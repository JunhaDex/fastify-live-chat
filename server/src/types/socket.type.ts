import { WebSocket } from '@fastify/websocket'

export interface WebSocketExtended extends WebSocket {
  id: string
}
