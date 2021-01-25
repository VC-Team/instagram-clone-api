const Notification = require("../model/notification")
const { ObjectID } = require("mongodb")

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

module.exports = notificationController