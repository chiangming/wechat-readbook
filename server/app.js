const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const session = require('express-session')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const config = require('./config.js')
const sqlQuery = require('./utils/mysql-async')

const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

function connect () {
  return mysql.createConnection(config.mysqlConfig)
}

function randomArray (n, l) {
  let rnd = []
  for (let i = 0; i < n; i++) {
    let index = Math.floor(Math.random() * l)
    // if (!rnd.includes(index)) {
    rnd.push(index)
    // }
  }
  return rnd
}

function createData (results, key) {
  return handleData(results[key])
}

function handleData (data) {
  data['selected'] = false
  data['private'] = false
  data['cache'] = false
  data['havaRead'] = 0
  let coverUrl = config.coverBaseUrl + '/' + data['categoryText'] + '/' + data['coverName']
  data['cover'] = coverUrl
  return data
}

function formatCategoryList (results) {
  const result = {}
  for (let categoryId = 1; categoryId <= config.category.length; categoryId++) {
    let subList = results.filter(item => item.category === categoryId)
    subList.map(item => {
      return handleData(item)
    })
    result[config.category[categoryId - 1]] = subList
  }
  return result
}

function formatCategories (results) {
  const result = []
  for (let categoryId = 1; categoryId <= config.category.length; categoryId++) {
    let subList = results.filter(item => item.category === categoryId)
    result.push({
      category: categoryId,
      length: subList.length
    })
  }
  return result
}

function formatCategoryType (results, type) {
  let list = results.filter(item => item.category === type)
  list.map(item => {
    return handleData(item)
  })
  return list
}

function formatGuessYouLike (data) {
  const n = parseInt(randomArray(1, 3)) + 1
  const index = parseInt(randomArray(1, config.relatedBookName.length))
  data['type'] = n
  switch (n) {
    case 1:
      data['result'] = config.relatedBookName[index]
      break
    case 2:
      data['result'] = config.relatedBookName[index]
      break
    case 3:
      data['result'] = config.relatedBookName[index]
      data['percent'] = (Math.floor(Math.random()) * 50 + 50) + '%'
      break
  }
  return data
}

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

app.get('/api/book/shelf', (req, res) => {
  res.json({
    error_code: 0,
    bookList: []
  })
})

app.get('/api/book/list', (req, res) => {
  const conn = connect()
  conn.query('select * from book', (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      res.json({
        error_code: 0,
        data: formatCategoryList(results),
        length: results.length
      })
    }
    conn.end()
  })
})

app.get('/api/mall', (req, res) => {
  const conn = connect()
  conn.query('select * from book', (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      const random = []
      const rankListNewBook = formatCategoryType(results, 9)
      const rankListNovel = formatCategoryType(results, 7)
      const categories = formatCategories(results)
      const length = results.length

      randomArray(9, length).forEach(key => {
        random.push(createData(results, key))
      })

      res.json({
        error_code: 0,
        rankListNewBook,
        rankListNovel,
        random,
        categories
      })
    }
    conn.end()
  })
})

app.get('/api/mall/rank-list-all', (req, res) => {
  const conn = connect()
  conn.query('SELECT * FROM `book` ORDER BY `book`.`totalReaders` DESC limit 20', (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      results.map(item => {
        return handleData(item)
      })
      res.json({
        error_code: 0,
        rankListAll: results
      })
    }
    conn.end()
  })
})

app.get('/api/mall/rank-list-rising', (req, res) => {
  const conn = connect()
  conn.query('SELECT * FROM `book` ORDER BY `book`.`lastMonthReaders` DESC limit 20', (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      results.map(item => {
        return handleData(item)
      })
      res.json({
        error_code: 0,
        rankListRising: results
      })
    }
    conn.end()
  })
})

app.get('/api/discovery/guess-your-like', (req, res) => {
  const conn = connect()
  conn.query('select * from book', (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      const guessYourLike = []
      const length = results.length

      randomArray(9, length).forEach(key => {
        guessYourLike.push(formatGuessYouLike(createData(results, key)))
      })

      res.json({
        error_code: 0,
        guessYourLike
      })
    }
    conn.end()
  })
})

app.get('/api/discovery/recommend', (req, res) => {
  const conn = connect()
  conn.query('select * from book', (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      const recommend = []
      const length = results.length

      randomArray(20, length).forEach(key => {
        recommend.push(createData(results, key))
      })

      res.json({
        error_code: 0,
        recommend
      })
    }
    conn.end()
  })
})

app.get('/api/book/detail', (req, res) => {
  const conn = connect()
  const fileName = req.query.fileName
  const sql = `select * from book where fileName ='${fileName}'`
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({
        error_code: 10001,
        msg: 'Fail to connect the database!' + err
      })
    } else {
      if (results && results.length === 0) {
        res.json({
          error_code: 10002,
          msg: 'Fail to get detail result!' + err
        })
      } else {
        const book = handleData(results[0])
        res.json({
          error_code: 0,
          msg: 'Succeed to get detail result!',
          data: book
        })
      }
    }
    conn.end()
  })
})

app.get('/api/comment', async (req, res) => {
  const fileName = req.query.fileName
  const beforeSize = parseInt(req.query.beforeSize)
  const pageSize = parseInt(req.query.pageSize)
  let result = await sqlQuery(`SELECT * FROM comment WHERE fileName = ? ORDER BY id DESC LIMIT ?,?`, [fileName, beforeSize, pageSize])
  console.log(result)
  res.json({
    error_code: 0,
    msg: '获取评论成功!',
    data: result
  })
})

app.post('/api/comment', async (req, res) => {
  const fileName = req.body.fileName
  const score = req.body.score
  const message = req.body.message
  const guestName = req.body.guestName
  const guestAvatar = req.body.guestAvatar
  let result = await sqlQuery(`INSERT INTO comment (id, fileName, score, message, guestName, guestAvatar) VALUES (NULL, ?, ?, ?, ?, ?)`, [fileName, score, message, guestName, guestAvatar])
  console.log(result)
  res.json({
    error_code: 0,
    msg: '评论成功!',
    data: result
  })
})

app.get('/api/github/github_oauth', async (req, res) => {
  const code = req.query.code
  let path = 'https://github.com/login/oauth/access_token'
  const params = {
    client_id: config.oAuth.github.client_id,
    client_secret: config.oAuth.github.client_secret,
    code: code
  }
  await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
    .then(result => {
      console.log('result:', result)
      return result.text()
    })
    .then(body => {
      console.log('body:', body)
      const args = body.split('&')
      let arg = args[0].split('=')
      console.log(arg)
      return arg[1]
    }).then(async (token) => {
      console.log('token:', token)
      const url = ' https://api.github.com/user?access_token=' + token
      await fetch(url)
        .then(result => {
          console.log('fetchresult:', result)
          return result.json()
        })
        .then(async (result) => {
          console.log('fetchresult2:', result)
          let userId = 0
          let selectGuest = await sqlQuery(`SELECT * FROM user WHERE role = 'GUEST' AND userName = ?`, [result.login])
          if (selectGuest.length > 0) {
            userId = selectGuest[0].id
            await sqlQuery(`UPDATE user SET avatar = ?, email = ? WHERE id = ?`, [result.avatar_url, result.email, userId])
          } else {
            let newGuest = {
              userName: result.login,
              avatar: result.avatar_url,
              email: result.email || 'empty',
              role: 'GUEST',
              createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            let insertGuest = await sqlQuery(`INSERT INTO user SET ?`, newGuest)
            if (insertGuest.affectedRows > 0) {
              userId = insertGuest.insertId
            }
          }
          if (userId > 0) {
            req.session.user = result.login
            // 用户token
            const userToken = {
              name: result.login,
              id: userId
            }
            // 签发token
            const token = jwt.sign(userToken, config.tokenSecret, { expiresIn: '2h' })
            res.json({
              success: 1,
              token: token,
              userName: result.login,
              avatar: result.avatar_url,
              message: 'GitHub授权登录成功'
            })
          } else {
            res.json({
              success: 0,
              token: '',
              message: 'GitHub授权登录失败'
            })
          }
        })
    })
    .catch(e => {
      console.log(e)
      res.json({
        success: 0,
        token: '',
        message: 'GitHub授权登录失败' + e
      })
    })
})

app.get('/api/tencent/news', async (req, res) => {
  const page = req.query.page
  const params = {
    cid: config.newsConfig.cid,
    token: config.newsConfig.token,
    id: config.newsConfig.id,
    ext: config.newsConfig.ext
  }

  let path = config.newsUrl + `?cid=${params.cid}&token=${params.token}&id=${params.id}&ext=${params.ext}&page=${page}`
  console.log(path)
  await fetch(path)
    .then(result => {
      return result.json()
    })
    .then(json => {
      res.json(json)
      console.log(json)
    })
    .catch(e => {
      console.log(e)
      res.json({
        code: 1,
        token: '',
        msg: '获取新闻信息失败失败' + e
      })
    })
})

const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('server is listening at http://%s:%s', host, port)
})
