import Player from './entities/Player'

export const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
export let context = canvas?.getContext('2d')

/*
* Set initial canvas size based on screen size
*/

export const CELL = 30
const MAP_WIDTH = 15

export const DIMENSIONS = CELL * MAP_WIDTH

if (canvas) {
    canvas.width = DIMENSIONS
    canvas.height = DIMENSIONS
}

/*
* Player
*/

export const PLAYER = new Player()

console.log(PLAYER)

// console.log(PLAYER)