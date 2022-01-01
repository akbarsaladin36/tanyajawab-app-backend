const redis = require('redis')
const client = redis.createClient()
const helper = require('../../helpers/helper')
const answerModel = require('./answer_model')
const notificationModel = require('../notification/notification_model')

module.exports = {
    getAllAnswer: async (req,res) => {
        try {
            const { id } = req.params
            const result = await answerModel.getAllAnswerDataByQuestionId(id)
            if(result.length > 0) {
                client.set(`getdata:${id}`, JSON.stringify(result))
                return helper.response(res, 200, `All answers for the question id ${id} successfully appeared!`, result)
            } else {
                return helper.response(res, 400, `All answers for the question id ${id} is not found!`, null)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    getAllAnswerByUser: async (req, res) => {
        try {
            const { id } = req.params
            const result = await answerModel.getAllAnswerByUserId(id)
            if(result.length > 0) {
                client.set(`getdata:${id}`, JSON.stringify(result))
                return helper.response(res, 200, `All answer by user id ${id} is successfully showed!`, result)
            } else {
                return helper.response(res, 400, `All answer data by user id ${id} is not found!`, null)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    addAnswer: async (req, res) => {
        try {
            const { questionId, answerBody } = req.body
            const setData = {
                user_id: req.decodeToken.user_id,
                question_id: questionId,
                answer_text: answerBody
            }
            const setData1 = {
                user_id: req.decodeToken.user_id,
                notification_body: `the user id ${req.decodeToken.user_id} is answered the question ${questionId} successfully!`,
                notification_type: 'answer'
            }
            const result = await answerModel.createAnswerData(setData)
            const result2 = await notificationModel.createNotificationData(setData1)
            return helper.response(res, 200, 'A first answer is successfully added! Wait until author find your answer and reply it.', [result, result2])
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    updateAnswer: async (req, res) => {
        try {
            const { id } = req.params
            const { answerBody, questionId } = req.body
            const setData = {
                answer_text: answerBody,
                answer_updated_at: new Date(Date.now())
            }
            const setData1 = {
                user_id: req.decodeToken.user_id,
                notification_body: `the user id ${req.decodeToken.user_id} is answered the question ${questionId} successfully!`,
                notification_type: 'answer'
            }
            const result = await answerModel.getOneAnswerData(id)
            if(result.length === 0) {
                return helper.response(res, 400, `Your answer for id${id} is not found. Please try again!`, null)
            } else {
                const newResult = await answerModel.updateAnswerData(setData, id)
                const result2 = await notificationModel.createNotificationData(setData1)
                return helper.response(res, 200, `Your answer for id${id} is updated successfully!`, [newResult, result2])
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    deleteAnswer: async (req, res) => {
        try {
            const { id } = req.params
            const result = await answerModel.getOneAnswerData(id)
            if(result.length === 0) {
                return helper.response(res, 400, `Your answer for id${id} is not found. Please try again!`, null)
            } else {
                const newResult = await answerModel.deleteAnswerData(id)
                return helper.response(res, 200, `The answer for id${id} is successfully deleted!`, newResult)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    }
}