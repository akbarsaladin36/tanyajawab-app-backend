const connection = require('../../config/mysql')

module.exports = {
    getAllData: (limit, offset, sort, keywords) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM users WHERE user_username LIKE '%${keywords}%' ORDER BY ${sort} LIMIT ? OFFSET ?`, [limit, offset], (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },
    getDataCount: (keywords) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(*) AS total FROM users WHERE user_username LIKE '%${keywords}%'`, (error, result) => {
                !error ? resolve(result[0].total) : reject(new Error(error))
            })
        })
    },
    getOneData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE user_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },
    updateOneData: (setData, id) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE users SET ? WHERE user_id = ?', [setData, id], (error, result) => {
                if(!error){
                    const newResult = {
                        id: id,
                        ...setData
                    }
                    resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    deleteOneData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM users WHERE user_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    }
}
