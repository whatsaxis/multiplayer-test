/*
* Other online players
*/

import Entity from '../Entity'

import { Point2D } from '../types'
import { CELL } from '../main'

class Other extends Entity {
    constructor(position: Point2D) {
        super({
            scale: { x: CELL, y: CELL },
            position: position,
            color: '#ff0000',
            collisions: false
        })
    }
}

export default Other