import Vue from 'vue'
import Vuex from 'vuex'

// 安装vuex插件
Vue.use(Vuex)

// 创建对象
const store = new Vuex.Store({
  state: {
    message: 1000
  },
  mutations: {

  },
  actions: {

  },
  getters: {
    showMessage (state, getters) {
      return function (addition) {
        return 'addition:' + addition
      }
    }
  },
  modules: {

  }
})

// 导出store
export default store

console.log(store)
