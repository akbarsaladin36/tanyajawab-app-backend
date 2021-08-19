const connection = require('../../config/mysql')

module.exports = {
  registerUserData: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET ?', setData, (error, result) => {
        if (!error) {
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

  getUserDataCondition: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },

  updateVerifyUserData: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET ? WHERE user_id = ?',
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...data
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
