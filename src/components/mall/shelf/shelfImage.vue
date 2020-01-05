<template>
  <div class="shelf-image">
    <img class="book-img" :src="data.cover">
    <span class="icon-selected" :class="{'is-selected': data.selected}" v-show="isEditMode"></span>
    <div class="private-wrapper" v-show="data.private"></div>
    <div class="private-icon-wrapper" v-show="data.private">
      <span class="icon-private"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      data: Object,
      isEditMode: Boolean
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-image {
    position: relative;
    width: 100%;
    height: 100%;
    .book-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .4);
      &.is-selected {
        color: $color-blue;
      }
    }
    .private-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-width: px2rem(15);
      border-style: solid;
      border-color: transparent transparent rgba(0, 0, 0, .3) rgba(0, 0, 0, .3);
    }
    .private-icon-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: px2rem(30);
      height: px2rem(30);
      padding-bottom: px2rem(5);
      padding-left: px2rem(3);
      @include leftBottom;
      .icon-private {
        font-size: px2rem(12);
        color: white;
      }
    }
  }
</style>
