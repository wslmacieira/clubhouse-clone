export default class RomsController {
    constructor() { }

    onNewConnection(socket) {
        const { id } = socket
        console.log('connection stableshid with', id)
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