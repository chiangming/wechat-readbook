const mysql = require('mysql')
const { mysqlConfig: config } = require('../config')

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit
})

let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        return reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          connection.release()
          if (err) {
            return reject(err)
          } else {
            return resolve(rows)
          }
        })
      }
    })
  })
}

module.exports = query
