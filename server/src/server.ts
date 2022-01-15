import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'

import { PacketType, PacketJoinSelf, PacketMovement, PacketJoinSelfPlayers, PacketMoveOther, PacketJoinOther, PacketDisconnect } from '../../shared/packet'
import { PlayerConnection } from '../../shared/types'


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    serveClient: false
})

app.use(express.static(__dirname + '/assets'))

/*
* Routes
*/

let players: PlayerConnection[] = []
let sockets: { id: number, socket: Socket }[] = []

let id = 1

io.on('connection', (socket) => {
    console.log('[INFO] New connection!')
    const socketId = id

    socket.once(PacketType.JOIN_SELF, (packet: PacketJoinSelf) => {
        /*
        * Broadcast current players to new connection
        */

        const playersPacket: PacketJoinSelfPlayers = {
            $type: PacketType.JOIN_SELF_PLAYERS,
            payload: {
                players: players
            }
        }

        socket.emit(PacketType.JOIN_SELF_PLAYERS, playersPacket)

        /*
        * Register the new player and make all other clients aware
        * of the new connection
        */

        const player: PlayerConnection = { id: socketId, ...packet.payload }
        players.push(player)

        for (const s of sockets) {
            const packetJoinOther: PacketJoinOther = {
                $type: PacketType.JOIN_OTHER,
                payload: {
                    player: player
                }
            }

            s.socket.emit(PacketType.JOIN_OTHER, packetJoinOther)
        }

        sockets.push({ id: socketId, socket: socket })
        
        id += 1
    })
    
    socket.on(PacketType.MOVEMENT, (packet: PacketMovement) => {      
        const { newPosition } = packet.payload
        
        for (const s of sockets) {
            const movementPacket: PacketMoveOther = {
                $type: PacketType.MOVEMENT_OTHER,
                payload: {
                    id: socketId,
                    newPosition: newPosition
                }
            }

            s.socket.emit(PacketType.MOVEMENT_OTHER, movementPacket)
        }
    })

    socket.on('disconnect', () => {
        sockets = sockets.filter(s => s.id !== socketId)

        for (const s of sockets) {
            const packetJoinOther: PacketDisconnect = {
                $type: PacketType.DISCONNECT,
                payload: {
                    id: socketId
                }
            }

            s.socket.emit(PacketType.DISCONNECT, packetJoinOther)
        }

        socket.disconnect()
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

server.listen(3000, () => {
    console.log('Listening on port 3000.')
})