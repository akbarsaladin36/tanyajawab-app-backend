const express = require('express')
const router = express.Router()
const authController = require('./auth_controller')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/user-activation/:id', authController.verifyUser)

module.exports = router
