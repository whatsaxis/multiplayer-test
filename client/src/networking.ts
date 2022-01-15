import { io } from 'socket.io-client'
import { PacketType, PacketJoinSelf, PacketJoinSelfPlayers, PacketJoinOther, PacketMoveOther, PacketDisconnect } from '../../shared/packet'
import Other from './entities/Other'

import Screen from './canvas'
import { PLAYER } from './main'

/*
* Handle all networking and communication with the server
*/

export const socket = io()

let others: { [id: number]: Other } = { }

socket.on('connect', () => {

    const join_packet: PacketJoinSelf = {
        $type: PacketType.JOIN_SELF,
        payload: {
            position: { ...PLAYER.position }
        }
    }

    socket.emit(PacketType.JOIN_SELF, join_packet)

    socket.once(PacketType.JOIN_SELF_PLAYERS, (packet: PacketJoinSelfPlayers) => {
        const { players } = packet.payload

        console.log(players)

        for (const player of players) {
            others[player.id] = new Other(player.position)
        }
    })

    socket.on(PacketType.JOIN_OTHER, (packet: PacketJoinOther) => {
        const { player } = packet.payload

        others[player.id] = new Other(player.position)
    })

    socket.on(PacketType.MOVEMENT_OTHER, (packet: PacketMoveOther) => {
        const { id, newPosition } = packet.payload

        // Check if the ID is the client. Will be undefined if so, as
        // the player is encapsulated in the Player class, and not the Other object.
        if (!others[id]) return

        others[id].position = newPosition
    })

    socket.on(PacketType.DISCONNECT, (packet: PacketDisconnect) => {
        const { id } = packet.payload

        Screen.unregister(others[id])
        delete others[id]
    })

})