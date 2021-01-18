const File = require('../model/file')
const { ObjectID } = require("mongodb")

let fileController = {}

fileController.insert = async (data) => {
    const files = await File.insertMany(data)
    return files
}

fileController.getByFilter = async (filter = {}, projection = {}) => {
    const files = await File.find(filter, projection)
    return files
}

fileController.getById = async (id, projection = {}) => {
    const file = await getByFilter({ _id: ObjectID(id) }, projection)
    return file
}

fileController.updateByFilter = async (filter, dataUpdate) => {
    await File.updateMany(filter, dataUpdate)
    return true
}

fileController.updateById = async (id, dataUpdate) => {
    await updateByFilter({ _id: id }, dataUpdate)
    return true
}

fileController.deleteByFilter = async (filter) => {
    await File.delete(filter)
    return true
}

fileController.deleteById = async (id) => {
    await deleteByFilter({ _id: id })
    return true
}

module.exports = fileController