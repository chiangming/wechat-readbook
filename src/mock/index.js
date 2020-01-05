import Mock from 'mockjs'
import mallHome from './mallHome'

// 参数1：正则表达式URL
// 参数2：请求方式
Mock.mock(/api\/mall\/home/, 'get', mallHome)

export default Mock
