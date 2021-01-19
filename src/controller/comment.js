const Comment = require('../model/comment')
const { ObjectID } = require("mongodb")

let commentController = {}

commentController.insert = async (data) => {
    const comments = await Comment.insertMany(data)
    return comments
}

commentController.getByFilter = async (filter = {}, projection = {}) => {
    const comments = await Comment.find(filter, projection)
    return comments
}

commentController.getById = async (id, projection = {}) => {
    const [comment] = await commentController.getByFilter({ _id: ObjectID(id) }, projection)
    return comment
}

commentController.updateByFilter = async (filter, dataUpdate) => {
    await Comment.updateMany(filter, dataUpdate)
    return true
}

commentController.updateById = async (id, dataUpdate) => {
    await commentController.updateByFilter({ _id: ObjectID(id) }, dataUpdate)
    return true
}

commentController.deleteByFilter = async (filter) => {
    await Comment.remove(filter)
    return true
}

commentController.deleteById = async (id) => {
    await commentController.deleteByFilter({ _id: id })
    return true
}

module.exports = commentController