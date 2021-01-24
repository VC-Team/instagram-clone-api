const express = require('express');
const postController = require('../controller/post');
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
        (req) => [req.params.postId, req.user._id],
        postController.like,
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