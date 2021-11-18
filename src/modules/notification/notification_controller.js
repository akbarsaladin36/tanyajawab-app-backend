const helper = require('../../helpers/helper')
const notificationModel = require('./notification_model')

module.exports = {
    allNotifications: async (req, res) => {
        try {
            const { id } = req.params
            const result = await notificationModel.getAllNotificationData(id)
            return helper.response(res, 200, `All notification message for user ${id} is appeared!`, result)
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    }
}