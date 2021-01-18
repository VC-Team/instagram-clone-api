const mongoose = require("mongoose");

const onConnected = function () {
    console.log("[Mongo]: Connect succussfully");
}

const onError = function (error) {
    console.log("[Mongo] Error: ", error);
}

const connect = async function (mongoConfig) {
    const db = mongoose.connection;
    db.on("error", onError);
    db.on("open", onConnected);

    return await mongoose.connect(mongoConfig.uri, mongoConfig.options)
}

module.exports = {
    connect
}