const connection = require('../../config/mysql')

module.exports = {
    getAllNotificationData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM notifications WHERE user_id = ?', id, (error, result) => {
                if(!error){
                    resolve(result)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },

    createNotificationData: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO notifications SET ?', setData, (error, result) => {
                if(!error) {
                    const newResult = {
                        id: result.insertId,
                        ...setData
                    }
                    resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    }
}