<template>
  <div class="ranking-topCategory-container">
    <div class="ranking-block-container" v-for="(items, index) in rankLists" :key="index">
      <div class="ranking-block-header">
        <h2 class="ranking-block-header-title">{{items.title}}</h2>
        <span @click="showBookCategory(items.category, items.title)" class="ranking-block-header-link">
          <img :src="items.cover" alt="TOP200" class="ranking-block-header-cover">
        </span>
      </div>
      <div class="ranking-block-body">
        <div class="ranking-block-body-left">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(lists,listIndex) in items.list" :key="listIndex">
              <div :title="item.title" class="ranking-block-book" v-for="(item,index) in lists" :key="index">
                <span @click="showBookDetail(item)" class="ranking-block-book-link"></span>
                <div class="ranking-block-book-container">
                  <div class="wr-bookCover ranking-block-book-cover">
                    <img :src="coverUrl(item)" alt="书籍封面" class="wr-bookCover-img">
                    <div class="wr-bookCover-border"></div>
                    <span class="wr-bookCover-decor wr-bookCover-gradientDecor wr-bookCover-borderDecor"></span>
                  </div>
                  <div class="ranking-block-book-bookInfo">
                    <p class="ranking-block-book-title"><span class="ranking-block-book-index">{{listIndex*3+index+1}}</span>{{item.title}}</p>
                    <span class="ranking-block-book-author">{{item.author}}</span>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="ranking-block-footer">
        <span @click="showBookCategory(items.category, items.title)" class="ranking-block-footer-link">
          <span class="ranking-block-footer-link-text">{{$t('home.seeAll')}}</span>
          <span class="ranking-block-footer-link-icon icon-forward"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { categoryText } from '@/utils/book'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { detailMixin } from '@/utils/mixin'

import '@/assets/styles/swipe.css'
export default {
  mixins: [detailMixin],
  components: {
    swiper,
    swiperSlide
  },
  props: {
    rankLists: Array
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  methods: {
    showBookCategory (category, text) {
      this.$router.push({
        path: '/mall/list',
        query: {
          category: category,
          categoryText: text
        }
      })
    },
    categoryText (category) {
      return categoryText(category, this)
    },
    coverUrl (item) {
      return `${item.cover}`
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

.ranking-topCategory-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .ranking-block-container {
    margin-bottom: 40px;
    width: 49%;
    box-sizing: border-box;
    @media (max-width: 1332px){
        width: 48%;
        margin-bottom: 22px;
        padding: 0 40px;
    }
    @media (max-width: 1020px){
        width: 100%!important;
        margin-bottom: 14px;
    }
    @media (max-width: 460px){
        margin-bottom: 0;
        padding: 10px 10px 8px;
        &:nth-child(2n+0) {
          background-color: #f0f5ff;
        }
    }
    .ranking-block-header {
      // padding: px2rem(20) 0;
      border-radius: 0;
      border: solid hsla(0,0%,100%,.05);
      border-width: 0 0 1px;
      position: relative;
      border: 0;
      @media (max-width: 460px){
        padding: px2rem(12) 0 0;
        border-radius: 0;
        border: 0 solid hsla(0,0%,100%,.05);
      }
      @media (max-width: 960px) {
        padding: px2rem(12) 0;
      }
      .ranking-block-header-title {
        display: none;
      }
      .ranking-block-header-link {
        display: inline-block;
      }
      .ranking-block-header-cover {
        width: px2rem(176);
        display: inline-block;
        vertical-align: bottom;
        @media (max-width: 960px){
          width: px2rem(150);
        }
      }
    }
    .ranking-block-body{
      &:after{
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
      }
      .ranking-block-body-left {
        width: 100%;
        float: left;
        @media (max-width: 560px){
          float: none;
          width: 100%;
        }
        .swiper-slide {
          width: 48%;
          min-height: 200px;
          @media (max-width: 560px){
            width: 80%;
            &:last-child{
              width: 100%;
            }
          }
          .ranking-block-book {
            position: relative;
            border-radius: 0;
            border: solid hsla(0,0%,100%,.05);
            border-width: 0 0 1px;
            @media (max-width: 460px){
                display: none;
                border-radius: 0;
                border: 0 solid hsla(0,0%,100%,.05);
                &:nth-child(-n+3) {
                  display: block;
                }
            }
            .ranking-block-book-link {
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 1;
              -webkit-tap-highlight-color: rgba(0,0,0,0)!important;
              -webkit-tap-highlight-color: transparent!important;
            }
            .ranking-block-book-container{
              padding: px2rem(16) 0 px2rem(16) px2rem(16);
              margin-left: -px2rem(16);
              overflow: hidden;
              @media (max-width: 460px){
                padding-bottom: 0;
              }
              .wr-bookCover{
                display: block;
                width: px2rem(120);
                height: px2rem(174);
                box-shadow: 0 px2rem(2) px2rem(16) rgba(0,0,0,.08);
                background: #d8d8d8;
                position: relative;
                &.ranking-block-book-cover{
                  float: left;
                  width: 64px!important;
                  height: 92px!important;
                  @media (max-width: 460px){
                    width: 56px!important;
                    height: 81px!important;
                  }
                }
                img {
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    background-color: #d8d8d8;
                    -o-object-fit: cover;
                    object-fit: cover;
                }
                .wr-bookCover-decor {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    &.wr-bookCover-gradientDecor {
                        background-image: linear-gradient(90deg,hsla(0,0%,63.1%,.25),rgba(21,21,20,.1) 1%,hsla(0,0%,100%,.15) 4%,hsla(0,0%,58%,.1) 8%,hsla(0,0%,89%,0) 57%,rgba(223,218,218,.03) 91%,rgba(223,218,218,.05) 98%,hsla(0,0%,100%,.1));
                        box-shadow: inset 0 0 0 0 rgba(0,0,0,.1);
                    }
                }
              }

              .ranking-block-book-bookInfo{
                padding: 0 px2rem(10) 0 px2rem(72);
                margin-top: px2rem(20);
                .ranking-block-book-title {
                    font-size: px2rem(16);
                    line-height: px2rem(20);
                    font-weight: 500;
                    color: black;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    word-wrap: normal;
                    .ranking-block-book-index {
                        width: px2rem(18);
                        display: inline-block;
                        font-family: DIN-Medium,PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif;
                        font-size: px2rem(16);
                    }
                }
                .ranking-block-book-author {
                    position: relative;
                    display: inline-block;
                    margin-top: px2rem(6);
                    margin-left: px2rem(18);
                    font-size: px2rem(12);
                    z-index: 2;
                    color: #8a8c90;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    word-wrap: normal;
                }
              }
            }
          }
        }
      }
    }
    .ranking-block-footer {
        padding: px2rem(20) 0;
        .ranking-block-footer-link {
            font-size: 15px;
            color: #2d77cc;
            @media (max-width: 460px){
                width: 100%;
                height: px2rem(44);
                line-height: px2rem(44);
                display: inline-block;
                text-align: center;
                color: #2d77cc;
                background: #ffffff;
                font-weight: bold;
                border-radius: px2rem(10);
                border: 1px solid rgba(78, 73, 70, 0.13);
            }
            .ranking-block-footer-link-text {
                vertical-align: middle;
                margin-right: 5px;
            }
            .ranking-block-footer-link-icon {
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

}
</style>
