import { constants } from "../../_shared/constants.js"
import RoomController from "./controller.js"
import RoomSocketBuilder from "./util/roomSocket.js"

const room = {
    id: '0001',
    topic: 'Js Expert éh noix'
}

const user = {
    img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png',
    username: 'wslmacieira ' + Date.now()
}

const roomInfo = { user, room }

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.sockeUrl,
    namespace: constants.socketNamespaces.room
})

const dependecies = {
    socketBuilder,
    roomInfo
}

await RoomController.initialize(dependecies)

