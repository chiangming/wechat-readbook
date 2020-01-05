<template>
  <div class="view-profile">
    <div class="footer-wrapper">
      <common-footer :selectIndex="4"></common-footer>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import commonFooter from '../../components/common/footer'
export default {
  name: 'profile',
  components: {
    commonFooter
  },
  data () {
    return {
    }
  },
  methods: {
    // btnClick () {
    //   console.log('btn click~')
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .view-profile{
    position: relative;
    width: 100%;
    height: 100%;
    .footer-wrapper{
      position: absolute;
      bottom: 0;
      height: px2rem(42);
    }
  }
</style>
