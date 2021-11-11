const express = require('express')
const Route = express.Router()
const authRoutes = require('../modules/auth/auth_routes')
const usersRoutes = require('../modules/users/users_routes')
const questionRoutes = require('../modules/question/question_routes')
const answerRoutes = require('../modules/answer/answer_routes')

Route.use('/auth', authRoutes)
Route.use('/users', usersRoutes)
Route.use('/question', questionRoutes)
Route.use('/answer', answerRoutes)

module.exports = Route
