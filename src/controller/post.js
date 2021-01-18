const Post = require('../model/post')
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
    const post = await getByFilter({ _id: ObjectID(id) }, projection)
    return post
}

postController.updateByFilter = async (filter, dataUpdate) => {
    await Post.updateMany(filter, dataUpdate)
    return true
}

postController.updateById = async (id, dataUpdate) => {
    await updateByFilter({ _id: ObjectID(id) }, dataUpdate)
    return true
}

postController.deleteByFilter = async (filter) => {
    await Post.delete(filter)
    return true
}

postController.deleteById = async (id) => {
    await deleteByFilter({ _id: id })
    return true
}

postController.isAuthor = async (authorId, postId) => {
    const post = await postController.getById(postId)
    if(post.author == authorId){
        return true
    }
    return false
}

postController.deletePost = async (postId, authorId) => {
    if( await postController.isAuthor(authorId, postId)){
        await deleteById(postId)
        return true
    }  
    
    return false
}

postController.like = async (postId, userId) => {
    
}

module.exports = postController