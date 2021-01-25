const initWebSocketEvent = (server) => {
    var httpServer = require('http').Server(server);
    const io = require('socket.io')(httpServer);

    io.on('connection', function (socket) {
        socket.on('client send', function (data) {
            io.sockets.emit('server send', data);
        })
    })

    return io
}

module.exports = initWebSocketEvent