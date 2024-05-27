import fastify from 'fastify'
import ws from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'
import { WebSocketExtended } from '@/types/socket.type.js'

const server = fastify()
server.register(ws)

server.register(async (fastify) => {
  const wss = fastify.websocketServer
  wss.on('connection', (socket: WebSocketExtended) => {
    const socId = uuidv4()
    socket.id = socId
    console.log('client connected', socId)
  })
  fastify.get(
    '/receive',
    { websocket: true },
    (socket /* WebSocket */, req /* FastifyRequest */) => {
      console.log('received')
      socket.on('message', (message) => {
        console.log('message hook', message.toString())
        socket.send(`hi from server ${message.toString()}`)
      })
    }
  )
  fastify.get('/client', async (request, reply) => {
    const wss = fastify.websocketServer
    for (const socket of wss.clients as Set<WebSocketExtended>) {
      console.log('sending to client', socket.id)
    }
    reply.send({ msg: 'ok' })
  })
})

server.get('/healthz', async (request, reply) => {
  reply.send({ status: 'ok' })
})

server.post('/deliver', async (request, reply) => {
  const wss = server.websocketServer
  for (const socket of wss.clients) {
    socket.send('Hello from the server!')
  }
})

server.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
