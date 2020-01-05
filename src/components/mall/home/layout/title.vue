<template>
  <div class="home-title-wrapper">
    <div class="label">{{label}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    label: String
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";
  .home-title-wrapper {
    width: 100%;
    padding: px2rem(15) px2rem(10) px2rem(5);
    box-sizing: border-box;
    @include top;
    .label {
      flex: 1;
      font-size: px2rem(18);
      font-family: STZhongsong;
      color: #333;
      font-weight: bold;
    }
  }
</style>
