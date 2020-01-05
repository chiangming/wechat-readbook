<template>
  <div class="home-title-wrapper">
    <div class="label">{{label}}</div>
    <div class="btn" :class="{'touch': ifOnTouch}" @touchstart="onTouchStart" @touchend="onTouchEnd" @mousedown="onTouchStart" @mouseup="onTouchEnd" @click="click">{{btn}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    label: String,
    btn: String
  },
  data () {
    return {
      ifOnTouch: false
    }
  },
  methods: {
    onTouchStart () {
      this.ifOnTouch = true
    },
    onTouchEnd () {
      this.ifOnTouch = false
    },
    click () {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";
  .home-title-wrapper {
    width: 100%;
    padding: px2rem(15) px2rem(10);
    box-sizing: border-box;
    @include top;
    .btn {
      flex: 1;
      font-size: px2rem(14);
      text-align: center;
      border: #f8f8f8 1px solid;
      border-radius: px2rem(4);
      font-weight:bold;
      background: white;
      padding: px2rem(10) px2rem(10);
      color: rgba(64, 158, 255, 1);
      &.touch {
        color: rgba(64, 158, 255, .5);
      }
    }
  }
</style>
