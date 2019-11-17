<template>
  <div id="app">
    <span class="text">111111</span>
    <router-view></router-view>
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from './components/tabbar/MainTabBar'

document.addEventListener('DOMContentLoaded', () => {
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  const html = document.querySelector('html')
  html.style.fontSize = fontSize + 'px'
})

export default {
  name: 'App',
  data () {
    return {
      message: 'hello',
      btn: '按钮'
    }
  },
  components: {
    MainTabBar
  },
  methods: {
    btnClick () {
      console.log('btn click~')
    }
  }
}
</script>

<style scoped>

</style>
