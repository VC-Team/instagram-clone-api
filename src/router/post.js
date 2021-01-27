const express = require('express');
const { ObjectID } = require("mongodb")
const postController = require('../controller/post');
const notificationController = require('../controller/notification');
const router = express.Router();
const pipe = require('../helper/server').pipe

router.get('/:postId',
    pipe(
        (req) => [req.params.postId],
        postController.getById,
        { end: true }
    )
)

router.post('/',
    pipe(
        (req) => {
            return [{
                author: req.user._id,
                ...req.body,
                tags: req.body.tags.map(userId => ObjectID(userId))
            }]
        },
        postController.insert,        
    ),
    pipe(
        (req,res) => {
            if(!Array.isArray(req.body.tags)) return 
            const notification = {
                type: 0,
                createdBy: ObjectID(req.user._id),
                actionContent: req.body,
                receiver: req.body.tags.map(userId => ObjectID(userId))
            }

            notificationController.emitNotification(notification)
        },
        notificationController.insert,
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

router.post('/of-user/:userId',
    pipe(
        (req) => [
            { author: { $eq: req.params.userId } },
            {},
            req.body
        ],
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
            notificationController.emitNotification(notification, res.io)
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
        (req) => [req.user._id, req.body],
        postController.getNewsfeedOfUser,
        { end: true }
    )
)

module.exports = {
    router,
    config: {}
}