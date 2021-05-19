export default class RomsController {
    constructor() { }

    onNewConnection(socket) {
        const { id } = socket
        console.log('connection stableshid with', id)
    }

    joinRoom(socket, data) {
        console.log('dados recebidos', data)
    }

    getEvents() {
        const functions = Reflect.ownKeys(RomsController.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => [name, this[name].bind(this)])

        return new Map(functions)

        /*
            [
                ['onNewConnection', this.onNewConnection],
                ['disconnect', this.disconnect]
            ]
         */
    }
}