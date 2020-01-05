<template>
  <div class="shelf-category-wrapper">
    <div class="shelf-category" :class="{'is-edit': isEditMode}" v-if="data.itemList.length > 0">
      <div class="shelf-category-item" v-for="(item, index) in data.itemList" :key="index">
        <img class="shelf-category-img" v-lazy="item.cover"/>
      </div>
    </div>
    <div class="shelf-category-bg" v-else>
      <span class="icon-book2"></span>
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
  .shelf-category-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shelf-category {
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      // justify-content: flex-start;
      width: 100%;
      height: 100%;
      padding-top: px2rem(5);
      box-sizing: border-box;
      opacity: 1;
      &.is-edit {
        opacity: .5;
      }
      .shelf-category-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        &:nth-child(3n+1) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
        }
        &:nth-child(3n+2) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(3n+3) {
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        .shelf-category-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .shelf-category-bg {
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(30);
      color: #ccc;
    }
  }
</style>
