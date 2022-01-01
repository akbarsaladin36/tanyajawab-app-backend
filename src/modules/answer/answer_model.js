const connection = require('../../config/mysql')

module.exports = {
    getAllAnswerDataByQuestionId: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM answers a JOIN users b ON b.user_id = a.user_id WHERE a.question_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },

    getAllAnswerByUserId: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM answers a JOIN questions b ON b.question_id = a.question_id WHERE a.user_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        }) 
    },

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