const express = require('express');
const router = express.Router();
const { ObjectID } = require("mongodb")
const pipe = require('../helper/server').pipe
const commentController = require('../controller/comment')
const notificationController = require('../controller/notification')
const postController = require('../controller/post')

router.put('/:postId',
    pipe(
        (req) => [req.params.postId, req.body],
        commentController.updateById,
        { end: true }
    ),
)

router.delete('/:postId',
    pipe(
        (req) => [req.params.postId],
        commentController.deleteById,
        { end: true }
    ),
)

router.get('/comments-of-post/:postId',
    pipe(
        (req) => [
            {
                postId: ObjectID(req.params.postId)
            }
        ],
        commentController.getByFilter,
        { end: true }
    )
)

router.get('/comments-of-comment/:commentId',
    pipe(
        (req) => [
            {
                parentId: ObjectID(req.params.commentId)
            }
        ],
        commentController.getByFilter,
        { end: true }
    )
)

router.post('/like',
    pipe(
        (req) => {
            return [
                req.body.commentId,
                {
                    $addToSet: {
                        peopleLike: ObjectID(req.user._id)
                    }
                }
            ]
        },
        commentController.updateById,
    ),
    pipe(
        async req => {
            const comment = await commentController.getById(req.commentId)
            return [{
                type: 0,
                createdBy: ObjectID(req.user._id),
                receiver: [ObjectID(comment.author._id)],
                impactedObjectId: ObjectID(req.commentId)
            }]
        },
        notificationController.insert,
        {end:true}
    )
)

router.post('/unlike',
    pipe(
        (req) => [
            req.body.commentId,
            {
                $pull: {
                    peopleLike: {
                        $in: [ObjectID(req.user._id)]
                    }
                }
            }
        ],
        commentController.updateById,
        { end: true }
    )
)

router.post('/:postId',
    pipe(
        (req) => {
            let tags = req.body.tags || []

            return [{
                ...req.body,
                postId: ObjectID(req.params.postId),
                author: ObjectID(req.user._id),
                tags: tags.map(userId => ObjectID(userId))
            }]
        },
        commentController.insert,
    ),
    pipe(
        async (req) => {
            const post = await postController.getById(req.params.postId)

            const notification = {
                type: 1,
                createdBy: ObjectID(req.user._id),
                actionContent: req.body,
                receiver: [
                    ...req.body.tags.map(userId => ObjectID(userId)),
                    ObjectID(post.author._id),
                ],
                impactedObjectId: ObjectID(req.params.postId),
            }

            notificationController.emitNotification(notification, res.io)

            return [notification]
        },
        notificationController.insert,
        { end: true, transformBeforeEnd: null }
    )
)

router.post('/reply/:parentId',
    pipe(
        (req) => {
            let tags = req.body.tags || []

            return [{
                ...req.body,
                parentId: ObjectID(req.params.parentId),
                author: ObjectID(req.user._id),
                tags: tags.map(userId => ObjectID(userId))
            }]
        },
        commentController.insert,        
    ),
    pipe(
        async (req) => {
            const comment = await postController.getById(req.params.parentId)

            const notification = {
                type: 1,
                createdBy: ObjectID(req.user._id),
                actionContent: req.body,
                receiver: [
                    ...req.body.tags.map(userId => ObjectID(userId)),
                    ObjectID(comment.author._id),
                ],
                impactedObjectId: ObjectID(req.params.postId),
            }

            notificationController.emitNotification(notification, res.io)

            return [notification]
        },
        notificationController.insert,
        { end: true }
    )
)

module.exports = {
    router,
    config: {}
}