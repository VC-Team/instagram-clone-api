const User = require('../model/user')
const { ObjectID } = require("mongodb")

let userController = {}

userController.insert = async (data) => {
    const users = await User.insertMany(data)
    return users
}

userController.getByFilter = async (filter = {}, projection = {}) => {
    const users = await User.find(filter, projection)
    return users
}

userController.getById = async (id, projection = {}) => {
    const [user] = await userController.getByFilter({ _id: ObjectID(id) }, projection)
    return user
}

userController.updateByFilter = async (filter, dataUpdate) => {
    await User.updateMany(filter, dataUpdate)
    return true
}

userController.updateById = async (id, dataUpdate) => {
    await userController.updateByFilter({ _id: ObjectID(id) }, dataUpdate)
    return true
}

userController.deleteByFilter = async (filter) => {
    await User.remove(filter)
    return true
}

userController.deleteById = async (id) => {
    await deleteByFilter({ _id: id })
    return true
}

userController.getFollowing = async (userId) => {
    const [following] = await User.aggregate([
        {
            $match: { _id: ObjectID(userId) }
        },
        {
            $lookup: {
                from: "users",
                let: { following: "$following" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $in: ["$_id", "$$following"]
                            }
                        }
                    },
                    {
                        $project: { following: 0 }
                    }
                ],
                as: "following",
            }
        },
    ]);

    return following && following.following;
}

userController.getFollowers = async (userId) => {
    const follower = await userController.getByFilter(
        {
            following: {
                $elemMatch: {
                    $eq: ObjectID(userId)
                }
            }
        },
        { following: 0, password: 0 }
    )
    return follower
}

userController.isBlock = async (userId, userBlockId) => {
    const user = userController.getById(userId)
    const isBlock = user.block.some(userId => userId == userBlockId)
    return isBlock
}

userController.acceptFollow = async (userId, followerId) => {
    await User.updateOne(
        {
            _id: ObjectID(userId)
        },
        {
            $addToSet: {
                following: followerId
            },
        }
    )
    return true
}

userController.unfollow = async (userId, followerId) => {
    const [user] = await userController.getById(userId)

    const following = user.following.filter(id => {
        return followerId != id
    })

    await userController.updateById(
        userId,
        { following }
    )
    return true
}

module.exports = userController