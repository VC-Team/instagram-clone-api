const Post = require('../model/post')
const User = require('../model/user')
const userController = require('../controller/user')
const { ObjectID } = require("mongodb")

let postController = {}

postController.insert = async (data) => {
    const posts = await Post.insertMany(data)
    return posts
}

postController.getByFilter = async (filter = {}, projection = {}) => {
    const posts = await Post.find(filter, projection)
    return posts
}

postController.getById = async (id, projection = {}) => {
    const [post] = await postController.getByFilter({ _id: ObjectID(id) }, projection)
    return post
}

postController.updateByFilter = async (filter, dataUpdate) => {
    await Post.updateMany(filter, dataUpdate)
    return true
}

postController.updateById = async (id, dataUpdate) => {
    await postController.updateByFilter({ _id: ObjectID(id) }, dataUpdate)
    return true
}

postController.deleteByFilter = async (filter) => {
    await Post.remove(filter)
    return true
}

postController.deleteById = async (id) => {
    await postController.deleteByFilter({ _id: id })
    return true
}

postController.isAuthor = async (authorId, postId) => {
    const post = await postController.getById(postId)
    return post.author.toString() == authorId.toString()
}

postController.deletePost = async (postId, authorId) => {
    if (await postController.isAuthor(authorId, postId)) {
        await postController.deleteById(postId)
        return true
    }
    return false
}

// =========================== REACTION TO POST ==============================

postController.isLiked = async (postId, userId) => {
    const post = await postController.getById(postId)
    return post.peopleLike.includes(ObjectID(userId))
}

postController.like = async (postId, userId) => {
    if (await postController.isLiked(postId, userId)) return false
    await postController.updateById(
        postId,
        {
            $addToSet: { peopleLike: ObjectID(userId) },
        }
    )
    return true
}

postController.unlike = async (postId, userId) => {
    if (await !postController.isLiked(postId, userId)) return false

    await postController.updateById(
        postId,
        {
            $pull: { peopleLike: ObjectID(userId) },
        }
    )
    return true
}

// =========================== GET NEWS FEED ==============================

postController.getNewsfeedOfUser = async (userId) => {
    let posts = await Post.aggregate([
        {
            $match: {
                author: ObjectID(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $project: {
                totalLike: { $size: "$peopleLike" },
                author: { $arrayElemAt: ["$author", 0] },
                caption: "$caption",
                medias: "$medias",
                amILike: {
                    $cond: { if: { $in: [userId, "$peopleLike"] }, then: 1, else: 0 }
                }
            }
        },
    ])

    return posts
}

module.exports = postController