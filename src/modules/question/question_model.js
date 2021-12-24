const connection = require('../../config/mysql')

module.exports = {
    getAllQuestionData: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM questions a JOIN users b ON a.user_id = b.user_id', (error, result) => {
                !error ? resolve(result) : reject(new Error(error)) 
            })
        })
    },

    getOneQuestionData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM questions WHERE question_id = ?', id, (error, result) => {
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

    getAllAnswerDetail: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT a.user_username, b.answer_text, b.answer_created_at FROM answers b JOIN users a ON b.user_id = a.user_id WHERE question_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    },

    createQuestionData: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO questions SET ?', setData, (error, result) => {
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

    updateQuestionData: (setData, id) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE questions SET ? WHERE question_id = ?', [setData, id], (error, result) => {
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

    deleteQuestionData: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM questions WHERE question_id = ?', id, (error, result) => {
                !error ? resolve(result) : reject(new Error(error))
            })
        })
    }
}