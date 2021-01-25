const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const Routes = require("./router")
const initWebSocketEvent = require("./event/websocket")

const Server = {}

const initDefaultMiddleware = (server) => {
    server.use(cors())
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: false }))
}

Server.start = (apiConfig) => {
    const { port = 9520, prefix } = apiConfig

    let server = express()

    var httpServer = require('http').Server(server);
    const io = require('socket.io')(httpServer);
    server.use(function (req, res, next) {
        res.io = io
        next();
    })

    initDefaultMiddleware(server)
    Routes.init(server, prefix)

    httpServer.listen(port, () => {
        console.log(`[API] Running on port ${port}`)
    })
}

module.exports = Server