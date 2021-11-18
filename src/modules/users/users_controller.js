const redis = require('redis')
const client = redis.createClient()

const helper = require('../../helpers/helper')
const usersModel = require('./users_model')
const notificationModel = require('../notification/notification_model')

module.exports = {
    searchUser: async (req, res) => {
        try {
            let {page, limit, sort, keywords} = req.query

            page = page ? parseInt(page) : 1
            limit = limit ? parseInt(limit) : 10
            sort = sort ? sort : 'user_username ASC'
            
            const totalData = await usersModel.getDataCount(keywords)
            const totalPage = Math.ceil(totalData / limit)
            const offset = page * limit - limit
            const pageInfo = { page, totalPage, limit, totalData}

            const result = await usersModel.getAllData(limit, offset, sort, keywords)
            if (result.length === 0 ){
                return helper.response(res, 201, `The result of ${keywords} search is empty. Please try to type some words!`, null)
            } else if (result.length > 0) {
                client.set('getdata:all', JSON.stringify(result))
                return helper.response(res, 200, `The result of ${keywords} is successfully showed!`, result, pageInfo)
            } else {
                return helper.response(res, 400, 'Something wrong when you search a word! Please try again!', null)
            }
        } catch(err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    userProfile: async (req, res) => {
        try {
            const { id } = req.params
            const result = await usersModel.getOneData(id)
            if (result.length === 0) {
                return helper.response(res, 400, `The profile with user ${id} is not found. Please try again!`, null)
            } else {
                client.set(`getdata:${id}`, JSON.stringify(result))
                return helper.response(res, 200, `The profile with user ${id} is successfully showed!`, result)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    updateUserProfile: async (req, res) => {
        try {
            const { id } = req.params
            const { userUsername, userFirstName, userLastName, userAddress, userPhoneNumber } = req.body
            const setData = {
                user_username: userUsername,
                user_first_name: userFirstName,
                user_last_name: userLastName,
                user_address: userAddress,
                user_phone_number: userPhoneNumber
            }
            const setData1 = {
                user_id: req.decodeToken.user_id,
                notification_body: `Your profile ${id} is updated successfully!`,
                notification_type: 'profile'
            }
            const result = await usersModel.getOneData(id)
            if (result.length === 0) {
                return helper.response(res, 400, `The profile with user ${id} is not found. Please try again!`, null)
            } else {
                const newResult = await usersModel.updateOneData(setData, id)
                const result2 = await notificationModel.createNotificationData(setData1)
                return helper.response(res, 200, `The profile with user ${id} is successfully updated!`, [newResult, result2])
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    deleteUserProfile: async (req, res) => {
        try {
            const { id } = req.params
            const result = await usersModel.getOneData(id)
            if (result.length === 0) {
                return helper.response(res, 400, `The profile with user ${id} is not found. Please try again!`, null)
            } else {
                const newResult = await usersModel.deleteOneData(id)
                return helper.response(res, 200, `The profile with user ${id} is successfully deleted!`, newResult)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    }
}
