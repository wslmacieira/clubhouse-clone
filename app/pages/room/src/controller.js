import { constants } from "../../_shared/constants.js"

export default class RoomController {
    constructor({ roomInfo, socketBuilder }) {
        this.socketBuilder = socketBuilder
        this.roomInfo = roomInfo

        this.socket = {}
    }

    static async initialize(deps) {
        return new RoomController(deps)._initialize()
    }

    async _initialize() {
        this.socket = this._setupSocket()

        this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo)
    }

    _setupSocket() {
        return this.socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onDisconnected())
            .setOnRoomUpdated(this.onRoomUpdated())
            .build()
    }

    onRoomUpdated() {
        return (room) => console.log('room list!', room)
    }

    onDisconnected() {
        return (user) => console.log('user disconnected!', user)
    }

    onUserConnected() {
        return (user) => console.log('user connected!', user)
    }
}