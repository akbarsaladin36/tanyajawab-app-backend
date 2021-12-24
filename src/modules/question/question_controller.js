const redis = require('redis')
const client = redis.createClient()

const helper = require('../../helpers/helper')
const questionModel = require('./question_model')
const notificationModel = require('../notification/notification_model')

module.exports = {
    allQuestion: async (req, res) => {
        try {
            const result = await questionModel.getAllQuestionData()
            if(result.length > 0){
                // for(const e of result) {
                //     e.profileUser = await questionModel.getUserProfileData(e.user_id)
                // }
                client.set('getdata:all', JSON.stringify(result))
                return helper.response(res, 200, 'Successfully showed all of question!', result)
            } else {
                return helper.response(res, 201, 'All question is not found, Please become a first person to create a first question!', null)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },
    oneQuestion: async (req, res) => {
        try {
            const { id } = req.params
            const result = await questionModel.getOneQuestionData(id)
            if(result.length > 0){
                for(const e of result) {
                    e.profileUser = await questionModel.getUserProfileData(e.user_id)
                    e.allAnswer = await questionModel.getAllAnswerDetail(e.question_id)
                }
                client.set(`getdata:${id}`, JSON.stringify(result))
                return helper.response(res, 200, `Succesfully showed a question number ${id}!`, result)
            } else {
                return helper.response(res, 400, `The question number ${id} is not found. Please try again!`, null)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },
    createQuestion: async (req, res) => {
        try {
            const { questionTitle, questionBody, questionTag } = req.body
            const setData = {
                user_id: req.decodeToken.user_id,
                question_title: questionTitle,
                question_text: questionBody,
                question_tags: questionTag
            }
            const setData1 = {
                user_id: req.decodeToken.user_id,
                notification_body: `Your question for user_id ${req.decodeToken.user_id} is created successfully!`,
                notification_type: 'question'
            }
            const result = await questionModel.createQuestionData(setData)
            const result2 = await notificationModel.createNotificationData(setData1)
            return helper.response(res, 200, 'Successfully created a question. Your question will be answered soon!', [result, result2])
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },
    updateQuestion: async (req, res) => {
        try {
            const { id } = req.params
            const { questionTitle, questionBody, questionTag } = req.body
            const setData = {
                user_id: req.decodeToken.user_id,
                question_title: questionTitle,
                question_text: questionBody,
                question_tags: questionTag,
                question_updated_at: new Date(Date.now())
            }
            const setData1 = {
                user_id: req.decodeToken.user_id,
                notification_body: `The user ${req.decodeToken.user_id} updated the question id ${id} successfully!`,
                notification_type: 'question'
            }
            const result = await questionModel.getOneQuestionData(id)
            if(result.length === 0) {
                return helper.response(res, 400, `Your question with id ${id} is not found. Please try again!`, null)
            } else {
                const newResult = await questionModel.updateQuestionData(setData, id)
                const result2 = await notificationModel.createNotificationData(setData1)
                return helper.response(res, 200, `Your question with id ${id} is successfully updated!`, [newResult, result2])
            }
        } catch(err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },
    deleteQuestion: async (req, res) => {
        try {
            const { id } = req.params
            const setData = {
                user_id: req.decodeToken.user_id,
                notification_body: `The user id ${req.decodeToken.user_id} has deleted the question no.${id} successfully!`,
                notification_type: 'question'
            }
            const result = await questionModel.getOneQuestionData(id)
            if(result.length === 0) {
                return helper.response(res, 400, `Your question with id${id} is not found. Please try again!`, null)
            } else {
                const newResult = await questionModel.deleteQuestionData(id)
                const result2 = await notificationModel.createNotificationData(setData) 
                return helper.response(res, 200, `Succesfully deleted the question with id${id}!`, [newResult, result2])
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    }
}