const express = require('express')
const authMiddleware = require('../../middleware/auth')
const redisMiddleware = require('../../middleware/redis')
const answerController = require('./answer_controller')
const router = express.Router()

router.get('/question/:id', authMiddleware.userAuthentication, answerController.getAllAnswer)
router.get('/all-answers/:id', authMiddleware.userAuthentication, answerController.getAllAnswerByUser)
router.post('/', authMiddleware.userAuthentication, answerController.addAnswer)
router.patch('/:id', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, answerController.updateAnswer)
router.delete('/:id', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, answerController.deleteAnswer)

module.exports = router