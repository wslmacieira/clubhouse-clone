import { constants } from "../../_shared/constants.js"
import SocketBuilder from "../../_shared/socketBuilder.js"

const socketBuilder = new SocketBuilder({
    socketUrl: constants.sockeUrl,
    namespace: constants.socketNamespaces.room
})

const socket = socketBuilder
    .setOnUserConnected((user) => console.log('user connected!', user))
    .setOnUserDisconnected((user) => console.log('user connected!', user))
    .build()

const room = {
    id: Date.now(),
    topic: 'Js Expert éh noix'
}

const user = {
    img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png',
    username: 'wslmacieira'
}

socket.emit(constants.events.JOIN_ROOM, { user, room })