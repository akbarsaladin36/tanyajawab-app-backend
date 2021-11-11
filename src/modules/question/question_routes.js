const express = require('express')
const authMiddleware = require('../../middleware/auth')
const redisMiddleware = require('../../middleware/redis')
const questionController = require('./question_controller')
const router = express.Router()

router.get('/', authMiddleware.userAuthentication, questionController.allQuestion)
router.get('/:id', authMiddleware.userAuthentication, questionController.oneQuestion)
router.post('/', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, questionController.createQuestion)
router.patch('/:id', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, questionController.updateQuestion)
router.delete('/:id', authMiddleware.userAuthentication, redisMiddleware.clearDataRedis, questionController.deleteQuestion)

module.exports = router