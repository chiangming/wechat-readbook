<template>
  <div id="app">
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
#app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: #7d8188;
    overflow: hidden;
  }
</style>
