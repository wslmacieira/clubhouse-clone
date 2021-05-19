import http from 'http';
import { Server } from 'socket.io'

export default class SocketServer {
    #io
    constructor({ port }) {
        this.port = port
    }

    async start() {
        const server = http.createServer((request, response) => {
            response.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            })

            response.end('hey there!')
        })

        this.#io = new Server(server, {
            cors: {
                origin: '*',
                credentials: false
            }
        })

        return new Promise((resolve, reject) => {
            server.on('error', reject)

            server.listen(this.port, () => resolve(server))
        })

    }
}