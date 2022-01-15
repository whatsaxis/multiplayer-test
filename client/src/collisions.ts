import Screen from './canvas'
import Entity from './Entity'

import { Space2D } from './types'

import { DIMENSIONS } from './main'


function range(value: number, min: number, max: number) {
    return (value >= min) && (value <= max)
}

export function isColliding(a: Space2D, b: Space2D) {
    const x = range(a.position.x, b.position.x, (b.position.x + b.scale.x)) ||
              range(b.position.x, a.position.x, (a.position.x + a.scale.x))

    const y = range(a.position.y, b.position.y, (b.position.y + b.scale.y)) ||
              range(b.position.y, a.position.y, (a.position.y + a.scale.y))

    return x && y
}

export function isPastBorder(vector: Space2D) {
    if (
        vector.position.y === 0                            ||
        vector.position.y + vector.scale.y === DIMENSIONS  ||
        vector.position.x === 0                            ||
        vector.position.x + vector.scale.x === DIMENSIONS
    ) return true

    return false
}

export function canMove(entity: Entity) {

    // Maybe we can implement collisions in the future :)

    /*
        const entityVector: Space2D = {
            position: { ...entity.position },
            scale: { ...entity.scale }
        }

        if ( isPastBorder(entityVector) ) return false

        if (entity.collisions) {
            for (const s of Screen.entities.filter(e => e != entity && e.collisions === true)) {
                if (
                    isColliding
                    (
                        entityVector,
                        { position: s.position, scale: s.scale }
                    )
                ) return false
            }
        }
    */

    return true
}