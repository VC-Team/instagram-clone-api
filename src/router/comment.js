const express = require('express');
const router = express.Router();
const { ObjectID } = require("mongodb")
const pipe = require('../helper/server').pipe
const commentController = require('../controller/comment')

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
        { end: true }
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
        { end: true }
    ),
)

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
        (req) => [
            req.body.commentId,
            {
                $addToSet: {
                    peopleLike: ObjectID(req.body.userId)
                }
            }
        ],
        commentController.updateById,
    )
)

router.post('/unlike',
    pipe(
        (req) => [
            req.body.commentId,
            {
                $pull: {
                    peopleLike: {
                        $eq: ObjectID(req.body.userId)
                    }
                }
            }
        ],
        commentController.updateById,
    )
)

module.exports = {
    router,
    config: {}
}