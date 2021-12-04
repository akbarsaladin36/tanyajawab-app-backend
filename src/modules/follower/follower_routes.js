const express = require('express')
const router = express.Router()
const followerController = require('./follower_controller')
const authMiddleware = require('../../middleware/auth')

router.get('/:id', authMiddleware.userAuthentication, followerController.allFollowers)
router.post('/', authMiddleware.userAuthentication, followerController.followOne)
router.delete('/:id', authMiddleware.userAuthentication, followerController.unfollowOne)

module.exports = router