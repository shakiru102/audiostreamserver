import http from 'http'
import socketIO, { Socket } from 'socket.io'


const PORT = process.env.PORT || 8080
const server = http.createServer((req, res) => res.end('Server runing successfully'))
server.listen(PORT, () => console.log('server running on PORT ' + PORT))
// @ts-ignore
const io = socketIO(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket: Socket) => {
    socket.emit('userID', socket.id)
    socket.on('initiateAudioChat', (details: { name: string; code: string; userId: string }) => {
       socket.broadcast.to(details.code).emit('userCalling', { name: details.name, userId: details.userId, calling: true })
    })
    socket.on('sendAudio', (audioDetails: { audioData: any, userId: string }) => {
        socket.broadcast.to(audioDetails.userId).emit('audioData', { audioData: audioDetails.audioData, calling: false})
    })
    
    socket.on('disconnect', () => io.emit('callSession', { userId: socket.id, message: 'Call session has ended' }))
})
