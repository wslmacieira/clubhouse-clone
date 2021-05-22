import { constants } from "../../_shared/constants.js"
import Attendee from "./entities/attendee.js"

export default class RoomController {
    constructor({ roomInfo, socketBuilder, view, peerBuilder, roomService }) {
        this.socketBuilder = socketBuilder
        this.peerBuilder = peerBuilder
        this.roomInfo = roomInfo
        this.view = view
        this.roomService = roomService

        this.socket = {}
    }

    static async initialize(deps) {
        return new RoomController(deps)._initialize()
    }

    async _initialize() {
        this._setupViewEvents()
        this.socket = this._setupSocket()
        this.roomService.setCurrentPeer(await this._setupWebRTC())
    }

    _setupViewEvents() {
        this.view.updateUserImage(this.roomInfo.user)
        this.view.updateRoomTopic(this.roomInfo.room)
    }

    _setupSocket() {
        return this.socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onDisconnected())
            .setOnRoomUpdated(this.onRoomUpdated())
            .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
            .build()
    }

    async _setupWebRTC() {
        return this.peerBuilder
            .setOnError(this.onPeerErro())
            .setOnConnectionOpened(this.onPeerConnectionopened())
            .build()
    }

    onPeerErro() {
        return (error) => { 
            console.log('deu ruim', error);
        }
    }
    // quando a conexão for aberta ele pede para entrar na sala do socket
    onPeerConnectionopened() {
        return (peer) => {
            console.log('peeeer', peer)
            this.roomInfo.user.peerId = peer.id
            this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo)
         }
    }

    onUserProfileUpgrade() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('onUserProfileUpgrade', attendee)
            this.roomService.upgradeUserPermission(attendee)
            if (attendee.isSpeaker) {
                this.view.addAttendeeOnGrid(attendee, true)
            }
            this.activeUserFeatures()
        }
    }

    onRoomUpdated() {
        return (data) => {
            const users = data.map(item => new Attendee(item))
            this.roomService.updateCurrentUserProfile(users)
            this.view.updateAttendeesOnGrid(users)
            this.activeUserFeatures()
            console.log('room list!', users)
        }
    }

    onDisconnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log(`${attendee.username} disconnected!`)
            this.view.removeItemFromGrid(attendee.id)
        }
    }

    onUserConnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('user connected!', attendee)
            this.view.addAttendeeOnGrid(attendee)
        }
    }

    activeUserFeatures() {
        const currentUser = this.roomService.getCurrentUser()
        this.view.showUserFeatures(currentUser.isSpeaker)
    }
}