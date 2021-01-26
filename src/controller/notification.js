const Notification = require("../model/notification")
const { ObjectID } = require("mongodb")
const userController = require("../controller/user")
const commentController = require("../controller/comment")
const postController = require("../controller/post")

let notificationController = {}

notificationController.insert = async (data) => {
    const notifications = await Notification.insertMany(data)
    return notifications
}

notificationController.getByFilter = async (filter = {}, projection = {}) => {
    const notifications = await Notification.find(filter, projection)
    return notifications
}

notificationController.getById = async (id, projection = {}) => {
    const [notification] = await notificationController.getByFilter({ _id: ObjectID(id) }, projection)
    return notification
}

notificationController.updateByFilter = async (filter, dataUpdate) => {
    await Notification.updateMany(filter, dataUpdate)
    return true
}

notificationController.updateById = async (id, dataUpdate) => {
    await notificationController.updateByFilter({ _id: ObjectID(id) }, dataUpdate)
    return true
}

notificationController.deleteByFilter = async (filter) => {
    await Notification.remove(filter)
    return true
}

notificationController.deleteById = async (id) => {
    await notificationController.deleteByFilter({ _id: id })
    return true
}

notificationController.getDetail = async (notification) => {
    let detailNotification = {}

    detailNotification.createdby = await userController.getById(notification.createdBy)

    if (notification.type == 1) {
        // comment
        detailNotification.actionContent = await commentController.getById(notification.actionContent)
    }

    if (notification.impactedObjectId) {
        detailNotification.impactedObject = await postController.getById(notification.impactedObjectId)
    }

    return detailNotification
}

notificationController.getListNotificationOfUser = async (userId) => {
    const notifs = await notificationController.getByFilter({
        receiver: {
            $elemMatch: { $eq: ObjectID(userId) }
        }
    })

    let listNotifDetail = []

    for (let index = 0; index < notifs.length; index++) {
        const notifDetail = await notificationController.getDetail(notifs[index])
        listNotifDetail.push(notifDetail)
    }

    return listNotifDetail
}

module.exports = notificationController