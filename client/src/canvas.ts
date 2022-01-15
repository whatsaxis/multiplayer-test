import { canvas, context } from './main'
import Entity from './Entity'
import Player from './entities/Player'

namespace Screen {
    export let entities: Entity[] = []

    export function register(entity: Entity) {
        entities.push(entity)
        paint()
    }

    export function unregister(entity: Entity) {
        entities = entities.filter(e => e !== entity)
        paint()
    }

    export function clear() {
        /*
        * Helper function to clear the canvas
        */

        if (!canvas || !context) return

        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    export function paint() {
        if (!canvas || !context) return

        clear()

        /*
        * Paint the canvas
        */

        for (const entity of entities) {
            const { x, y } = entity.position
            
            context.fillStyle = entity.color
            context.fillRect(x, y, entity.scale.x, entity.scale.y)
        }
    }
}

export default Screen