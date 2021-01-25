const express = require('express');
const router = express.Router();
const { ObjectID } = require("mongodb")
const pipe = require('../helper/server').pipe
const notificationController = require('../controller/notification')

router.get('/',
    pipe(
        (req) => [req.user._id],
        notificationController.getListNotificationOfUser,
        { end: true }
    )
)

module.exports = {
    router,
    config: {}
}