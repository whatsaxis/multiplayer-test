/*
* Player data type for transmission over networks
*/

export interface PlayerConnection {
    id: number,
    position: Point2D
}

/*
* Some shared interfaces for representing things in 2 dimensions
*/

export interface Point2D {
    x: number,
    y: number
}