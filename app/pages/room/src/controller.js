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
        this.roomService.init()

        this.socket = this._setupSocket()
        this.roomService.setCurrentPeer(await this._setupWebRTC())
    }

    _setupViewEvents() {
        this.view.configureOnMicrophoneActivation(this.onMicrophoneActivation())
        this.view.configureLeaveButton()
        this.view.updateUserImage(this.roomInfo.user)
        this.view.updateRoomTopic(this.roomInfo.room)
        this.view.configureClapButton(this.onClapPressed())
    }

    onMicrophoneActivation() {
        return async () => {
            await this.roomService.toggleAudioActivation()
        }
    }

    onClapPressed() {
        return () => {
            this.socket.emit(constants.events.SPEAK_REQUEST, this.roomInfo.user)
        }
    }

    _setupSocket() {
        return this.socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onDisconnected())
            .setOnRoomUpdated(this.onRoomUpdated())
            .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
            .setOnSpeakRequested(this.onSpeakRequested())
            .build()
    }

    onSpeakRequested() {
        return (data) => {
            const attendee = new Attendee(data)
            const result = prompt(`${attendee.username} pediu para falar!, aceitar? 1 sim, 0 não`)
            this.socket.emit(constants.events.SPEAK_ANSWER, { answer: !!Number(result), user: attendee })
        }
    }

    async _setupWebRTC() {
        return this.peerBuilder
            .setOnError(this.onPeerError())
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .setOnCallReceived(this.onCallReceived())
            .setOnCallError(this.onCallError())
            .setOncallClose(this.onCallClose())
            .setOnStreamReceived(this.onStreamReceived())
            .build()
    }

    onStreamReceived() {
        return (call, stream) => {
            const callerId = call.peer
            console.log('onStreamReceived', call, stream)
            const { isCurrentId } = this.roomService.addReceivedPeer(call)
            // console.warn('audio desabilitado')
            this.view.renderAudioElement({
                callerId,
                stream,
                isCurrentId
            })
        }
    }

    onCallClose() {
        return (call) => {
            console.log('onCallClose', call)
            const peerId = call.peer
            this.roomService.disconnectPeer({ peerId })
        }
    }

    onCallError() {
        return (call, error) => {
            console.log('onCallError', call, error)
            const peerId = call.peer
            this.roomService.disconnectPeer({ peerId })
        }
    }

    onCallReceived() {
        return async (call) => {
            const stream = await this.roomService.getCurrentStream()
            console.log('answering call', call, stream)
            call.answer(stream)
        }
    }

    onPeerError() {
        return (error) => {
            console.log('deu ruim', error);
        }
    }
    // quando a conexão for aberta ele pede para entrar na sala do socket
    onPeerConnectionOpened() {
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
            if (attendee.isSpeaker) {
                this.roomService.upgradeUserPermission(attendee)
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

            this.roomService.disconnectPeer(attendee)
        }
    }

    onUserConnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('user connected!', attendee)
            this.view.addAttendeeOnGrid(attendee)

            // vamos ligar!!
            this.roomService.callNewUser(attendee)
        }
    }

    activeUserFeatures() {
        const currentUser = this.roomService.getCurrentUser()
        this.view.showUserFeatures(currentUser.isSpeaker)
    }
}