const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../../helpers/helper')
const authModel = require('./auth_model')
const nodemailer = require('nodemailer')
require('dotenv').config()

module.exports = {
  register: async (req, res) => {
    try {
      const { userEmail, userUsername, userPassword } = req.body
      const checkEmailUser = authModel.getUserDataCondition({
        user_email: userEmail
      })
      if (checkEmailUser.length > 0) {
        return helper.response(
          res,
          403,
          'Your email is exist. Please try a new email!',
          null
        )
      } else {
        const salt = bcrypt.genSaltSync(10)
        const encryptPassword = bcrypt.hashSync(userPassword, salt)
        const setData = {
          user_email: userEmail,
          user_username: userUsername,
          user_password: encryptPassword,
          user_image: '',
          user_verify: 'N'
        }
        const result = await authModel.registerUserData(setData)
        delete result.user_password

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        })

        const mailOptions = {
          from: '"Admin" <tanyaJawab_admin@gmail.com>',
          to: result.user_email,
          subject: 'TanyaJawab App- Activation Email',
          html: `<b>Congratulation! Now you can activate your account now. Please click this link to activate it.</b><a href="${process.env.SMTP_URL}/auth/user-activation/${result.id}">Click!</>`
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
            return helper.response(res, 400, 'Email not send !')
          } else {
            console.log('Email have been sent to:' + info.response)
            return helper.response(
              res,
              200,
              'Email verification is sent. Please check your email right now!'
            )
          }
        })

        return helper.response(
          res,
          200,
          'User is successfully created.',
          result
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  login: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const checkEmailUser = await authModel.getUserDataCondition({
        user_email: userEmail
      })
      if (checkEmailUser.length > 0) {
        const checkPassword = bcrypt.compareSync(
          userPassword,
          checkEmailUser[0].user_password
        )
        if (checkPassword) {
          const payload = checkEmailUser[0]
          delete payload.user_password
          const token = jwt.sign({ ...payload }, process.env.JWT_SECRETKEY, {
            expiresIn: '24h'
          })
          const result = { ...payload, token }
          return helper.response(
            res,
            200,
            'User is successfully logged in to website',
            result
          )
        } else {
          return helper.response(
            res,
            404,
            'Password is incorrect. please try again.',
            null
          )
        }
      } else {
        return helper.response(
          res,
          400,
          'Email is incorrect. Please try again.',
          null
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  verifyUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await authModel.updateVerifyUserData(
        { user_verify: 'Y' },
        id
      )
      return helper.response(
        res,
        200,
        'Success verified your account. You can login right now.',
        result
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', null)
    }
  }
}
