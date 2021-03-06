class PeerCustomModule extends globalThis.Peer {
    constructor({ config, onCall }) {
        // debugger
        super(...config)

        this.onCall = onCall
    }

    call(...args) {
        const originalCallResult = super.call(...args)

        // aqui acontece a magia, interceptamos o call e adicionamos
        // o comportamento do call para todos os objetos
        this.onCall(originalCallResult)

        return originalCallResult
    }
}

export default class PeerBuilder {
    constructor({ peerConfig }) {
        this.peerConfig = peerConfig
        this.onError = () => { }
        this.onConnectionOpened = () => { }
        this.onCallError = () => { }
        this.oncallClose = () => { }
        this.onCallReceived = () => { }
        this.onStreamReceived = () => { }

    }

    setOnError(fn) {
        this.onError = fn

        return this;
    }

    setOnConnectionOpened(fn) {
        this.onConnectionOpened = fn

        return this;
    }

    setOnCallError(fn) {
        this.onCallError = fn

        return this
    }

    setOncallClose(fn) {
        this.oncallClose = fn

        return this
    }

    setOnCallReceived(fn) {
        this.onCallReceived = fn

        return this
    }

    setOnStreamReceived(fn) {
        this.onStreamReceived = fn

        return this
    }

    _prepareCallEvent(call) {
        call.on('stream', (stream) => this.onStreamReceived(call, stream))
        call.on('error', (error) => this.onCallError(call, error))
        call.on('close', () => this.oncallClose(call))

        this.onCallReceived(call)
    }

    build() {
        // o peer recebe uma lista de argumentos,
        // new Peer(id, config', config2)
        // params = [], new Peer(...params)

        // const peer = new globalThis.Peer(...this.peerConfig)
        const peer = new PeerCustomModule({
            config: [...this.peerConfig],
            onCall: this._prepareCallEvent.bind(this)
        })

        peer.on('error', this.onError)
        peer.on('call', this._prepareCallEvent.bind(this))

        return new Promise((resolve) => peer.on('open', () => {
            this.onConnectionOpened(peer)
            return resolve(peer)
        }))
    }
}
