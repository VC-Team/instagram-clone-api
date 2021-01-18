var express = require('express');
const postController = require('../controller/post');
var router = express.Router();

router.post('/', 
    pipe(
        (req) => [req.body],
        postController.insert,
        {end: true}
    )
)

router.put('/:postId', 
    pipe(
        (req) => [req.params.postId , req.body],
        postController.insert,
        {end: true}
    )
)

router.delete('/:postId', 
    pipe(
        (req) => [req.params.postId , req.user._id],
        postController.deletePost,
        {end: true}
    )
)

router.get('/of-user/:userId', 
    pipe(
        (req) => [{author: {$eq: req.params.userId}}],
        postController.getByFilter,
        {end: true}
    )
)

router.post('/:postId/like', 
    pipe(
        (req) => [req.params.postId, req.user._id],
        postController.insert,
        {end: true}
    )
)

module.exports = {
    router,
    config: {}
}