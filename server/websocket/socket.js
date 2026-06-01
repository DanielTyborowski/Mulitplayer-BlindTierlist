import { WebSocketServer } from 'ws'
import { handleMessage } from './handlers.js'

export const setupWS = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
      handleMessage(ws, JSON.parse(msg))
    })
  })
}