import Screen from './canvas'

import { EntityOptions, Space2D, Point2D, Point2DSafe } from './types'
import { canMove, isColliding, isPastBorder } from './collisions'
import { DIMENSIONS } from './main'

/*
* Entity
*
* Base class for all things in the game
*/

abstract class Entity {
    private _scale: Point2DSafe
    private _position: Point2DSafe
    private _collisions: boolean
    public color: string

    constructor(options: EntityOptions) {
        const { scale, position, collisions, color } = options

        // Hacky solution to access this from inside setters
        const ENTITY = this

        this._scale = {
            _x: scale.x,
            _y: scale.y,

            get x() { return this._x },
            get y() { return this._y },

            set x(newX: number) {
                this._x = newX

                Screen.paint()
            },

            set y(newY: number) {
                this._y = newY

                Screen.paint()
            }
        }

        this._position = {
            _x: position.x,
            _y: position.y,

            get x() { return this._x },
            get y() { return this._y },

            set x(newX: number) {
                if (!canMove(ENTITY)) return

                this._x = newX

                Screen.paint()
            },

            set y(newY: number) {
                if (!canMove(ENTITY)) return

                this._y = newY

                Screen.paint()
            }
        }
        
        this._collisions = collisions

        this.color = color

        Screen.register(this)
    }

    public get scale() { return this._scale }
    public set scale(newSize: Point2D) {
        this._scale.x = newSize.x
        this._scale.y = newSize.y
    }

    public get position() { return this._position }
    public set position(newPos: Point2D) {
        /*
        * Check for collisions
        */

        if (!canMove(this)) return

        /* Update position */

        this._position.x = newPos.x
        this._position.y = newPos.y
    }

    public get collisions() { return this._collisions }
    public set collisions(newCollisions: boolean) {
        this._collisions = newCollisions
        Screen.paint()
    }
}

export default Entity