<template>
  <div class="ranking-allCategory-container">
    <div class="ranking-allCategory-header">
      <h2 class="ranking-allCategory-header-title">{{$t('home.category')}}</h2>
    </div>
    <ul class="ranking-allCategory-list">
      <li class="ranking-allCategory-list-li" v-for="(item, index) in data" :key="index" @click="showBookCategory(item)">
        <span class="ranking-allCategory-list-item">{{categoryText(item.category)}} · {{item.length + ' ' + $t('home.books')}}</span>
      </li>
    </ul>
    <div class="ranking-allCategory-footer">
      <a href="/discovery" class="ranking-allCategory-footer-link">
        <span class="ranking-allCategory-footer-link-text">{{$t('home.seeAll')}}</span>
        <span class="ranking-allCategory-footer-link-icon icon-forward"></span>
      </a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { categoryText, getCategoryName } from '@/utils/book'

export default {
  props: {
    data: Array
  },
  methods: {
    showBookCategory (item) {
      this.$router.push({
        path: '/mall/list',
        query: {
          category: getCategoryName(item.category),
          categoryText: this.categoryText(item.category)
        }
      })
    },
    categoryText (category) {
      return categoryText(category, this)
    },
    showBookList () {
      this.$router.push('/book-store/list')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

.ranking-allCategory-container {
    padding: 0 px2rem(20);
    background-image: linear-gradient(top, #2266aa, #2c77cc);
    .ranking-allCategory-header {
      position: relative;
      padding: px2rem(20) 0;
      border-radius: 0;
      border: solid hsla(0,0%,100%,.05);
      border-width: 0 0 1px;
      .ranking-allCategory-header-title {
        font-size: 20px;
        font-family: "STZhongsong";
        color: #eef0f4;
      }
    }
    .ranking-allCategory-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .ranking-allCategory-list-li {
          width: 24%;
          @media (max-width: 960px) {
            width: 47%;
          }
          @media (max-width: 1120px){
            width: 31%;
          }
          @media (max-width: 460px) {
            width: 47%;
          }
          position: relative;
          border: 0;
          .ranking-allCategory-list-item {
            display: inline-block;
            width: 100%;
            padding: px2rem(12) px2rem(12) px2rem(12) 0 ;
            margin-left: -px2rem(12);
            font-family: DIN-Regular,PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif;
            font-size: px2rem(16);
            color: #eef0f4;
          }
          .ranking-allCategory-list-all {
            padding: px2rem(17) 0 px2rem(17) px2rem(12);
            margin-left: -px2rem(12);
            display: inline-block;
            width: 100%;
            font-size: px2rem(16);
            color: #eef0f4;
            }
        }
    }
    .ranking-allCategory-footer {
      padding: px2rem(20) 0;
      @media (max-width: 460px) {
        padding-top: px2rem(20);
      }
      .ranking-allCategory-footer-link {
        font-size: px2rem(15);
        color: #b2b4b8;
        @media (max-width: 460px){
          width: 100%;
          height: px2rem(44);
          line-height: px2rem(44);
          display: inline-block;
          text-align: center;
          color: #eef0f4;
          font-weight: bold;
          border-radius: px2rem(10);
          border: 1px solid hsla(0,0%,100%,.2);
        }
        .ranking-allCategory-footer-link-text {
          vertical-align: middle;
          margin-right: px2rem(5);
        }
        .ranking-allCategory-footer-link-icon {
          @media (max-width: 460px){
            display: none;
          }
          display: inline-block;
          width: px2rem(7);
          height: px2rem(11);
          vertical-align: middle;
          background-size: 100%;
        }
      }
    }
}

</style>
