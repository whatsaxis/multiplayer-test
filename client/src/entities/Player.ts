/*
* Player
*/

import Entity from '../Entity'

import { socket } from '../networking'
import { PacketType, PacketMovement } from '../../../shared/packet'

import { CELL } from '../main'


class Player extends Entity {
    constructor() {
        super({
            scale: { x: CELL, y: CELL },
            position: { x: 250, y: 250 },
            color: '#000',
            collisions: true
        })

        /*
        * Player Controls
        */
    
        let keys = {
            'w': false,
            'a': false,
            's': false,
            'd': false
        }

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.key
            if (!Object.keys(keys).includes(key)) return

            keys[key as keyof typeof keys] = true
        })

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            const key = e.key
            if (!Object.keys(keys).includes(key)) return

            keys[key as keyof typeof keys] = false
        })

        setInterval(() => {
            if (keys['w'] === true) this.position.y -= 10
            if (keys['a'] === true) this.position.x -= 10
            if (keys['s'] === true) this.position.y += 10
            if (keys['d'] === true) this.position.x += 10

            this.broadcastPosition()
        }, 30)
    }

    broadcastPosition() {
        const packet: PacketMovement = {
            $type: PacketType.MOVEMENT,
            payload: {
                newPosition: this.position
            }
        }

        socket.emit(PacketType.MOVEMENT, packet)
    }
}

export default Player