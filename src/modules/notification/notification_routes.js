const express = require('express')
const authMiddleware = require('../../middleware/auth')
const notificationController = require('./notification_controller')
const router = express.Router()

router.get('/:id', authMiddleware.userAuthentication, notificationController.allNotifications)

module.exports = router