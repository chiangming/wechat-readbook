<template>
  <div class="mall-home">
    <router-view></router-view>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
    }
  },
  methods: {
    onRefresh (mun) { // 刷新回调
      setTimeout(() => {
        this.$refs.myScroll.setState(3)
      }, 500)
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  .mall-home{
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
