const express = require('express')
const Route = express.Router()
const authRoutes = require('../modules/auth/auth_routes')

Route.use('/auth', authRoutes)

module.exports = Route
