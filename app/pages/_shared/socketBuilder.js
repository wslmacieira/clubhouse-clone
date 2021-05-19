import { constants } from "./constants.js"

export default class SocketBuilder {
    constructor({ socketUrl, namespace }) {
        this.socketUrl = `${socketUrl}/${namespace}`

        this.onUserConnected = () => { }
        this.onUserDisconnected = () => { }
    }

    setOnUserConnected(fn) {
        this.onUserConnected = fn

        return this
    }

    setOnUserDisconnected(fn) { 
        this.OnUserDisconnected = fn
        
        return this
    }

    build() {
        const socket = globalThis.io.connect(this.socketUrl, {
            withCredentials: false
        })

        socket.on('connection', () => console.log('connectei!'))
        socket.on(constants.events.USER_CONNECTED, this.onUserConnected)
        socket.on(constants.events.USER_DISCONNECTED, this.onUserDisconnected)

        return socket
    }
}