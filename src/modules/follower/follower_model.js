const connection = require('../../config/mysql')

module.exports = {
    getAllFollowerData: (id) => {
        return new Promise ((resolve, reject) => {
            connection.query('SELECT * FROM followers WHERE user_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },
    getUserProfileData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT user_username, user_email, user_first_name, user_last_name FROM users WHERE user_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },
    getTotalFollowersData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(friend_id) FROM followers WHERE user_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },
    getOneFollowerData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM followers WHERE followers_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },
    createFollowerData: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO followers SET ?', setData, (error, result) => {
                if(!error){
                    const newResult = {
                        id: result.insertId,
                        ...setData
                    }
                    resolve(newResult);
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    deleteOneFollowerData: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM followers WHERE user_id = ? AND friend_id = ?', [userId, friendId], (error, result) => {
                if(!error){
                    const newResult = {
                        user_id: userId,
                        friend_id: friendId
                      }
                      resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    }
}