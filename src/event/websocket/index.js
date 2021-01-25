var server = require('http')
var io 

const initWebSocketEvent = (app) => {
    var server = require('http').Server(app);
    io = require('socket.io')(server);
    
    io.on('connection', function(socket) {
        socket.on('client send', function(data) {
            io.sockets.emit('server send', data);
        })
    });
    
    return server
}

module.exports = {
    initWebSocketEvent,
    socketService: io && io.sockets
}