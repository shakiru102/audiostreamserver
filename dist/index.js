"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const PORT = process.env.PORT || 8080;
const server = http_1.default.createServer((req, res) => res.end('Server runing successfully'));
server.listen(PORT, () => console.log('server running on PORT ' + PORT));
// @ts-ignore
const io = (0, socket_io_1.default)(server, {
    cors: {
        origin: '*'
    }
});
io.on('connection', (socket) => {
    socket.emit('userID', socket.id);
    socket.on('initiateAudioChat', (details) => {
        socket.broadcast.to(details.code).emit('userCalling', { name: details.name, userId: details.userId, calling: true });
    });
    socket.on('sendAudio', (audioDetails) => {
        socket.broadcast.to(audioDetails.userId).emit('audioData', { audioData: audioDetails.audioData, calling: false });
    });
    socket.on('disconnect', () => io.emit('callSession', { userId: socket.id, message: 'Call session has ended' }));
});
