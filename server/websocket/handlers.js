import { rooms } from '../game/rooms.js'
import {
  selectPosition,
  placeItem,
  lockRound,
  reveal
} from '../game/gameLogics.js'

export const handleMessage = (ws, data) => {

  const room = rooms[data.roomId]
  if (!room) return

  const player = room.players.find(p => p.id === data.playerId)

  switch (data.type) {

    case 'select':
      selectPosition(data.roomId, data.playerId, data.position)
      break

    case 'placeItem':
      placeItem(data.roomId, data.playerId)
      break

    case 'lockRound':
      lockRound(data.roomId)
      break

    case 'reveal':
      reveal(data.roomId)
      break
  }

}