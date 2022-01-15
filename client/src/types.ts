/*
* Entity
*/

export interface EntityOptions {
    color: string,
    scale: Point2D,
    position: Point2D,
    collisions: boolean
}

export interface Point2D {
    x: number,
    y: number
}

export interface Point2DSafe {
    _x: number,
    _y: number,
    x: number,
    y: number
}

export interface Space2D {
    scale: Point2D,
    position: Point2D
}