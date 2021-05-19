import RoomsController from "./controllers/roomsController.js";
import SocketServer from "./util/socket.js";
import Event from 'events';
import { constants } from './util/constants.js'

const port = process.env.PORT || 3000
const socketServer = new SocketServer({ port })
const server = await socketServer.start()

const roomsComntroller = new RoomsController()

const namespaces = {
    room: { controller: roomsComntroller, eventEmitter: new Event() }
}

const routeConfig = Object.entries(namespaces)
    .map(([namespace, { controller, eventEmitter }]) => {
        const controllerEvents = controller.getEvents()
        eventEmitter.on(
            constants.events.USER_CONNECTED,
            controller.onNewConnection.bind(controller)
        )

        return {
            [namespace]: { events: controllerEvents, eventEmitter }
        }
    })

socketServer.atachEvents({ routeConfig })

console.log('socket server is running at', server.address().port)