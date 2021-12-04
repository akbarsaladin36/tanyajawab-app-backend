const helper = require('../../helpers/helper')
const followerModel = require('./follower_model')
const notificationModel = require('../notification/notification_model')

module.exports = {
    allFollowers: async (req, res) => {
        try {
            const { id } = req.params
            const result = await followerModel.getAllFollowerData(id)
            if(result.length === 0) {
                return helper.response(res, 200, 'You are not have follower.', null)
            } else {
                for(const e of result) {
                    e.profileData = await followerModel.getUserProfileData(e.user_id)
                    e.followersCount = await followerModel.getTotalFollowersData(e.user_id)
                }
                return helper.response(res, 200, `Show all followers data from user id ${id} successfully!`, result)
            }
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    followOne: async (req, res) => {
        try {
            const { friendId } = req.query
            const setData = {
                user_id: req.decodeToken.user_id,
                friend_id: friendId,
                is_accepted: 'yes'
            }
            const setData1 = {
                user_id: req.decodeToken.user_id,
                notification_body: `the user ${req.decodeToken.user_id} has followed a user id ${friendId}!`,
                notification_type: 'follower'
            }
            const result = await followerModel.createFollowerData(setData)
            const result2 = await notificationModel.createNotificationData(setData1)
            return helper.response(res, 200, `You are followed friend from user id ${friendId}!`, [result, result2])
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    },

    unfollowOne: async (req, res) => {
        try {
            const { id } = req.params
            const { friendId } = req.query
            const result = await followerModel.deleteOneFollowerData(id, friendId)
            return helper.response(res, 200, `You are unfollowing a friend id ${friendId} successfully!`, result)
        } catch (err) {
            console.log(err)
            return helper.response(res, 404, 'Bad Request', null)
        }
    }
}