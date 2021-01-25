const express = require('express');
const { ObjectID } = require("mongodb")
const postController = require('../controller/post');
const notificationController = require('../controller/notification');
const router = express.Router();
const pipe = require('../helper/server').pipe
const { socketService } = require('../event/websocket/index')

router.get('/:postId',
    pipe(
        (req) => [req.params.postId],
        postController.getById,
        { end: true }
    )
)

router.post('/',
    pipe(
        (req) => [{
            author: req.user._id,
            ...req.body
        }],
        postController.insert,
        { end: true }
    )
)

router.put('/:postId',
    pipe(
        (req) => [req.params.postId, req.body],
        postController.updateById,
        { end: true }
    )
)

router.delete('/:postId',
    pipe(
        (req) => [req.params.postId, req.user._id],
        postController.deletePost,
        { end: true }
    )
)

router.get('/of-user/:userId',
    pipe(
        (req) => [{ author: { $eq: req.params.userId } }],
        postController.getByFilter,
        { end: true }
    )
)

router.post('/:postId/like',
    pipe(
        (req, res) => {
            return [req.params.postId, req.user._id]
        },
        postController.like,
    ),
    pipe(
        async (req, res) => {
            const post = await postController.getById(req.params.postId)
            const notification = {
                type: 0,
                createdBy: ObjectID(req.user._id),
                receiver: [ObjectID(post.author._id)],
                impactedObjectId: ObjectID(req.params.postId)
            }
            notification.receiver.forEach(receiver => {
                res.io.emit(`notification/${receiver}`, notification)
            })
            return [notification]
        },
        notificationController.insert,
        { end: true }
    )
)

router.post('/:postId/unlike',
    pipe(
        (req) => [req.params.postId, req.user._id],
        postController.unlike,
        { end: true }
    )
)

router.post('/newsfeed',
    pipe(
        (req) => [req.user._id],
        postController.getNewsfeedOfUser,
        { end: true }
    )
)

module.exports = {
    router,
    config: {}
}