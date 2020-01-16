<template>
  <div class="view-profile">
    <div class="view-content-wrapper">
      <my-test></my-test>
    </div>
    <div class="view-footer-wrapper">
      <common-footer :selectIndex="3"></common-footer>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import myTest from '../../components/common/test'
import commonFooter from '../../components/common/footer'

export default {
  name: 'profile',
  components: {
    commonFooter,
    myTest
  },
  data () {
    return {
      list: Object
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
  .view-profile{
    position: relative;
    width: 100%;
    height: 100%;
    .view-content-wrapper{
      height: px2rem(400);
      width:100%;
    }
    .view-footer-wrapper{
      position: absolute;
      bottom: 0;
      height: px2rem(42);
    }
  }
</style>
