const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./router");
const {initWebSocketEvent} = require("./event/websocket");

const Server = {}

const initDefaultMiddleware = (server) => {
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
}

Server.start = (apiConfig) => {
    const { port = 9520, prefix } = apiConfig;

    const app = express();
    const server = initWebSocketEvent(app)     
    initDefaultMiddleware(app);
    Routes.init(app, prefix);

    server.listen(port, () => {
        console.log(`[API] Running on port ${port}`);
    })
};

module.exports = Server;