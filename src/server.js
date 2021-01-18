const express = require("express");
const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./router");

const Server = {}

const initDefaultMiddleware = (server) => {
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
}

Server.start = (apiConfig) => {
    const { port = 9520, prefix } = apiConfig;

    const server = express();    

    initDefaultMiddleware(server);
    Routes.init(server, prefix);

    server.listen(port, () => {
        console.log(`[API] Running on port ${port}`);
    })

};

module.exports = Server;