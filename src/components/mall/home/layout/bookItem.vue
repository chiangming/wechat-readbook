<template>
      <div class="book-item"  @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" v-lazy="coverUrl(item)" :key="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-big" ref="title">{{item.title}}</div>
          <div class="author sub-title" ref="author">{{item.author}}</div>
        </div>
      </div>
</template>

<script type="text/ecmascript-6">
import { detailMixin } from '@/utils/mixin'
export default {
  mixins: [detailMixin],
  props: {
    item: Object
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

  .book-item {
        width: 100%;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        display: flex;
        &:first-child {
          margin-top: px2rem(0);
        }
        .img-wrapper {
          flex: 0 0 20%;
          padding: px2rem(10) px2rem(10) px2rem(10) 0;
          box-sizing: border-box;
          .img {
            width: 100%;
          }
        }
        .content-wrapper {
          flex: 1;
          padding: px2rem(10) 0;
          box-sizing: border-box;
          .title {
            line-height: px2rem(36);
          }
          .author {
            margin-top: px2rem(15);
          }
          .result {
            margin-top: px2rem(5);
          }
        }
      }
</style>
