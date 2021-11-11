const redis = require('redis')
const client = redis.createClient()
const helper = require('../../helpers/helper')
const answerModel = require('./answer_model')

module.exports = {
    addAnswer: async (req, res) => {
        try {
            const { questionId, answerBody } = req.body
            const setData = {
                user_id: req.decodeToken.user_id,
                question_id: questionId,
                answer_text: answerBody
            }
            const result = await answerModel.createAnswerData(setData)
            return helper.response(res, 200, 'A first answer is successfully added! Wait until author find your answer and reply it.', result)
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    updateAnswer: async (req, res) => {
        try {
            const { id } = req.params
            const { answerBody } = req.body
            const setData = {
                answer_text: answerBody,
                answer_updated_at: new Date(Date.now())
            }
            const result = await answerModel.getOneAnswerData(id)
            if(result.length === 0) {
                return helper.response(res, 400, `Your answer for id${id} is not found. Please try again!`, null)
            } else {
                const newResult = await answerModel.updateAnswerData(setData, id)
                return helper.response(res, 200, `Your answer for id${id} is updated successfully!`, newResult)
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