const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// function mock (app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }
// const mockBookHomeData = require('./src/mock/bookHome')
// const mockBookShelfData = require('./src/mock/bookShelf')
// const mockBookList = require('./src/mock/bookCategoryList')
// const mockBookFlatList = require('./src/mock/bookFlatList')
// const mockBookDetail = require('./src/mock/bookDetail')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
  },
  devServer: {
    // before (app) {
    //   mock(app, '/api/mall/home', mockBookHomeData)
    //   mock(app, '/api/book/shelf', mockBookShelfData)
    //   mock(app, '/api/book/list', mockBookList)
    //   mock(app, '/api/book/flat-list', mockBookFlatList)
    //   mock(app, '/api/book/detail', mockBookDetail)
    // }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 524288
    }
  }
}
