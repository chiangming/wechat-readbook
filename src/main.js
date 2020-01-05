import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import './lazy'
// import './mock'
import './assets/fonts/STZhongsong.css'
import './assets/styles/icon.css'
import './assets/styles/global.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
