import { PlayerConnection, Point2D } from './types'

export enum PacketType {
    JOIN_SELF         = 'packet:network:join-self-players',
    JOIN_SELF_PLAYERS = 'packet:network:join-self-players',
    JOIN_OTHER        = 'packet:network:join-other',
    DISCONNECT        = 'packet:network:disconnect',
    MOVEMENT          = 'packet:game:movement',
    MOVEMENT_OTHER    = 'packet:game:movement-other'
}

interface IPacket {
    $type: PacketType,
    payload: { }
}


/*
* Packet Definitions
*/

export interface PacketJoinSelf extends IPacket {
    $type: PacketType.JOIN_SELF,
    payload: {
        position: Point2D
    }
}

export interface PacketJoinSelfPlayers extends IPacket {
    $type: PacketType.JOIN_SELF_PLAYERS,
    payload: {
        players: PlayerConnection[]
    }
}

export interface PacketDisconnect extends IPacket {
    $type: PacketType.DISCONNECT,
    payload: {
        id: number
    }
}

export interface PacketJoinOther extends IPacket {
    $type: PacketType.JOIN_OTHER,
    payload: {
        player: PlayerConnection
    }
}

export interface PacketMovement extends IPacket {
    $type: PacketType.MOVEMENT,
    payload: {
        newPosition: Point2D
    }
}

export interface PacketMoveOther extends IPacket {
    $type: PacketType.MOVEMENT_OTHER,
    payload: {
        id: number,
        newPosition: Point2D
    }
}