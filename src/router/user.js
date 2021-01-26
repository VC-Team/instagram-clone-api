const { ObjectID } = require("mongodb");
const userController = require("../controller/user");
const { pipe } = require("../helper/server");
const router = require("express").Router();
const notificationController = require('../controller/notification')

router.get('/search/:value',
    pipe(
        (req) => [{
            $text: { $search: req.params.value }
        }],
        userController.getByFilter,
        { end: true }
    )
)

router.get('/:userId',
    pipe(
        (req) => [req.params.userId, { following: 0 }],
        userController.getById,
        { end: true }
    )
)

router.put('/:userId',
    pipe(
        (req) => [req.params.userId, req.body],
        userController.updateById,
        { end: true }
    )
)

router.get('/:userId/followings',
    pipe(
        (req) => [req.params.userId],
        userController.getFollowing,
        { end: true }
    )
)

router.get('/:userId/followers',
    pipe(
        (req) => [req.params.userId],
        userController.getFollowers,
        { end: true }
    )
)

router.post('/follow',
    pipe(
        (req, res) => {
            const notification = {
                type: 3,
                createdBy: ObjectID(req.user._id),
                receiver: [ObjectID(req.body.followerId)],
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

router.post('/acceptFollow',
    pipe(
        req => [req.body.acceptedUserId, req.user._id],
        userController.acceptFollow,
        {end: true}
    )
)

router.post('/unfollow',
    pipe(
        (req) => [req.user._id, req.body.followerId],
        userController.unfollow,
        { end: true }
    )
)

module.exports = {
    router,
    config: {}
}