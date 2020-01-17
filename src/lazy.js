import Vue from 'vue'
import lazyload from 'vue-lazyload'

Vue.use(lazyload, {
  error: require('@/assets/images/icon-white.png'),
  loading: require('@/assets/images/icon-white.png')
})
