const express = require('express')
const authMiddleware = require('../../middleware/auth')
const redisMiddleware = require('../../middleware/redis')
const usersController = require('./users_controller')
const router = express.Router()

router.get('/', authMiddleware.userAuthentication, usersController.searchUser)
router.get('/:id', authMiddleware.userAuthentication, usersController.userProfile)
router.patch('/:id', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, usersController.updateUserProfile)
router.delete('/:id', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, usersController.deleteUserProfile)

module.exports = router
