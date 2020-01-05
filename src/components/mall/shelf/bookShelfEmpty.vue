<template>
  <div class="book-shelf-empty-wrapper" ref="emptyView">
    <div class="empty-text-wrapper">
      <div class="empty-text" v-html="$t('shelf.welcome')"></div>
      <div class="empty-text" v-html="$t('shelf.welcomeSub')"></div>
    </div>
    <div class="empty-btn-wrapper">
      <div class="empty-btn" @click="gotoBookMall">{{$t('shelf.find')}}</div>
    </div>
  </div>
</template>

<script>
import { realPx } from '@/utils/utils'

export default {
  data () {
    return {
      img: require('@/assets/images/imooc.jpeg')
    }
  },
  methods: {
    gotoBookMall () {
      this.$router.push('/mall/home')
    }
  },
  mounted () {
    this.$refs.emptyView.style.height = window.innerHeight - realPx(42) + 'px'
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";

  .book-shelf-empty-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    justify-content:center;
    .empty-img-wrapper {
      width: 100%;
      margin-top: px2rem(50);
      text-align: center;
      .empty-img {
        width: px2rem(200);
        height: px2rem(200);
      }
    }
    .empty-text-wrapper {
      width: 100%;
      margin-top: px2rem(10);
      text-align: center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .empty-text {
        font-size: px2rem(16);
        color: #333;
        line-height: px2rem(30);
      }
    }
    .empty-btn-wrapper {
      width: 100%;
      padding: px2rem(30) px2rem(30) px2rem(15) px2rem(30);
      box-sizing: border-box;
      @include center;
      .empty-btn {
        width: 100%;
        font-size: px2rem(14);
        font-weight: bold;
        color: white;
        padding: px2rem(15) 0;
        text-align: center;
        border-radius: px2rem(10);
        background: $color-blue;
        &:first-child {
          background: $color-blue;
        }
        &:active {
          background: $color-blue-transparent;
        }
      }
    }
  }
</style>
