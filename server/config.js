const coverBaseUrl = 'http://103.14.34.148:9000/imgs'

const category = [
  'contemporary',
  'humanities',
  'history',
  'martial',
  'suspense',
  'romance',
  'fantasy',
  'compound',
  'free',
  'recommend'
]

const relatedBookName = [
  '沉思录',
  '吶喊',
  '在天堂裡遇見的五個人',
  '菊与剑',
  '失蹤之後',
  '美味人生烹飪課',
  '蘇西的世界',
  '明日綻放的花蕾',
  '謊言的年代',
  '夜間飛行'
]

const oAuth = {
  github: {
    client_id: '8947582dbbed86c4d51f',
    client_secret: '76d4c70645ad4865347549a4fd032bee1714591e'
  }
}

const tokenSecret = 'test'

const mysqlConfig = {
  host: '103.14.34.148',
  port: 3306,
  user: 'matt',
  password: 'jm19950123',
  database: 'book',
  connectionLimit: 10
}

module.exports = {
  coverBaseUrl,
  category,
  relatedBookName,
  oAuth,
  mysqlConfig,
  tokenSecret
}
