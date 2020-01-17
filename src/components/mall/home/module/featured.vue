<template>
  <div class="featured">
    <title-view :label="titleText" :btn="btnText" v-if="titleVisible && data && data.length > 0"></title-view>
    <div class="featured-list">
      <div class="featured-item-wrapper">
        <div class="featured-item" v-for="(item, index) in data" :key="index" @click="showBookDetail(item)">
          <div class="index-wrapper">
            <span class="index">{{index + 1}}</span>
          </div>
          <div class="img-wrapper">
            <img class="img" v-lazy="item.cover">
          </div>
          <div class="content-wrapper">
            <div class="item-title title-small" ref="title">{{item.title}}</div>
            <div class="item-author sub-title-tiny" ref="author">{{item.author}}</div>
            <p class="item-reading">
              <span class="item-starString">{{score(item)}}</span>
              <span class="item-starIcon-mini">
                <span class="item-starIcon-mini-after" :style="{width:starWidth(item)}"></span>
              </span>
              <span class="item-readingText"><em class="item-reading-number">{{item.todayReaders}}</em>人今日阅读</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import TitleView from '@/components/mall/home/layout/title'
import { realPx } from '@/utils/utils'
import { categoryText } from '@/utils/book'
import { detailMixin } from '@/utils/mixin'

export default {
  mixins: [detailMixin],
  components: {
    TitleView
  },
  props: {
    data: Array,
    titleVisible: {
      type: Boolean,
      default: true
    },
    titleText: {
      type: String
    },
    btnText: {
      type: String
    }
  },
  methods: {
    categoryText (category) {
      return categoryText(category, this)
    },
    score (item) {
      return (item.score / 10).toFixed(1)
    },
    starWidth (item) {
      return realPx(item.score * 59 / 100) + 'px'
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

  .featured {
    .featured-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .featured-item-wrapper {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .featured-item {
          flex: 0 0 100%;
          width: 100%;
          padding: px2rem(12) px2rem(20) px2rem(12) 0;
          @include center;
          .index-wrapper{
            vertical-align:middle;
            text-align:center;
            width: px2rem(48);
            font-size: px2rem(16);
          }
          .img-wrapper {
            width: px2rem(64)!important;
            height: px2rem(93)!important;
            .img {
              width: 100%;
              height: 100%;
            }
          }
          .content-wrapper {
            flex: 1;
            padding-left: px2rem(16);
            box-sizing: border-box;
            .item-title{
              padding-right: 0;
              font-size: px2rem(17);
              line-height: px2rem(26);
              overflow: hidden;
              height: px2rem(26);
              display: -webkit-box;
              display: -moz-box;
              text-overflow: ellipsis;
              -webkit-line-clamp: 1;
              -moz-line-clamp: 1;
              line-clamp: 1;
              -webkit-box-orient: vertical;
              -webkit-text-size-adjust: none;
              box-orient: vertical;
              height: auto;
              max-height: px2rem(26);
              font-family:'STZhongsong'
            }
            .item-author {
              margin-top: px2rem(6);
              font-size: px2rem(14);
              color: #b2b4b8;
              line-height: px2rem(21);
              overflow: hidden;
              height: px2rem(21);
              display: -webkit-box;
              display: -moz-box;
              text-overflow: ellipsis;
              -webkit-line-clamp: 1;
              -moz-line-clamp: 1;
              line-clamp: 1;
              -webkit-box-orient: vertical;
              -webkit-text-size-adjust: none;
              box-orient: vertical;
              height: auto;
              max-height: px2rem(21);
            }
            .item-reading{
              margin-top: px2rem(8);
              font-family: DIN-Medium,PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              word-break: break-all;
              word-wrap: normal;
              color: #8a8c90;
              font-size: px2rem(11);
              vertical-align: middle;
              .item-starString{
                display: inline-block;
                vertical-align: middle;
                font-size: px2rem(13);
              }
              .item-starIcon-mini{
                display: inline-block;
                vertical-align: middle;
                width: px2rem(59);
                height: px2rem(11);
                white-space: nowrap;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini.2bf7cdb2.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini.2bf7cdb2.png) 12px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini.2bf7cdb2.png) 24px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini.2bf7cdb2.png) 36px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini.2bf7cdb2.png) 48px 0 no-repeat;
                background-size: px2rem(11) px2rem(11);
                margin-right: px2rem(8);
                .item-starIcon-mini-after{
                      display: inline-block;
                      vertical-align: top;
                      width: 0;
                      height: px2rem(11);
                      background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini_selected.4bcd6d31.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini_selected.4bcd6d31.png) 12px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini_selected.4bcd6d31.png) 24px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini_selected.4bcd6d31.png) 36px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_mini_selected.4bcd6d31.png) 48px 0 no-repeat;
                      background-size: px2rem(11) px2rem(11);
                }
              }
              .item-readingText{
                vertical-align: middle;
                .item-reading-number{
                  font-size: px2rem(13);
                  margin-right: px2rem(3);
                }
              }
            }
            .category {
              margin-top: px2rem(5);
            }
          }
        }
      }
    }
  }
</style>
