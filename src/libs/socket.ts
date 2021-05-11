import http from 'http'
import { Server } from 'socket.io'

const defaultOption = {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
}

let io: Server | null = null

export const init = (httpServer: http.Server, option = defaultOption) => {
    io = require('socket.io')(httpServer, option)
    return io
}

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialsed.')
    }

    return io
}

export default { init, getIo }
