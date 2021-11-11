const connection = require('../../config/mysql')

module.exports = {
    getOneAnswerData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM answers WHERE answer_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },

    createAnswerData: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO answers SET ?', setData, (error, result) => {
                if(!error){
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
    },

    updateAnswerData: (setData, id) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE answers SET ? WHERE answer_id = ?', [setData, id], (error, result) => {
                if(!error) {
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

    deleteAnswerData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM answers WHERE answer_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    }
}