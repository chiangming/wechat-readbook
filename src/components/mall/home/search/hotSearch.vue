<template>
  <div>
    <div class="hot-search-list">
      <div class="hot-search-item" v-for="(item, index) in hotSearch" :key="index" :style="{background:((item.type === 1)?'#f4f4f4':'#eedddd')}">
        <div class="hot-search-text-wrapper">
          <div class="text" ref="searchText" :style="{color:((item.type === 1)?'#444444':'red')}">{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    label: String,
    btn: String,
    hotSearch: Array
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

  .hot-search-list {
    width: 100%;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    @include rowHistory;
    .hot-search-item {
      background: #f4f4f4;
      margin: px2rem(5) px2rem(10);
      border-radius: px2rem(20);
      box-sizing: border-box;
      .hot-search-text-wrapper {
        height: px2rem(35);
        .text {
          height: 100%;
          padding: 0 px2rem(10);
          flex: 1;
          @include ellipsis;
          @include left;
          font-size: px2rem(10);
          font-weight: bold;
          color: #444444;
        }
      }
    }
  }
</style>
