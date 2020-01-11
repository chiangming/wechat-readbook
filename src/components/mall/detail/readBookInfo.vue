<template>
<div class="readerBookInfo">
  <div class="readerBookInfo_head">
    <a href="javascript:" class="wr_bookCover bookInfo_cover">
      <img v-lazy="cover" alt="书籍封面" class="wr_bookCover_img">
      <div class="wr_bookCover_border"></div>
      <span class="wr_bookCover_decor wr_bookCover_gradientDecor wr_bookCover_borderDecor"></span>
    </a>
    <div class="bookInfo_right">
      <h2 class="bookInfo_title">{{title}}</h2>
      <div class="bookInfo_author_container">
        <span class="bookInfo_author link">{{author}}</span>
      </div>
      <!-- <a href="/web/category/all" target="_blank" class="bookInfo_rankList rankList_all"></a> -->
      <div class="bookInfo_intro hasMore">
        <span>{{desc}}</span>
        <span class="bookInfo_intro_hasMore" @click="showDialog()">更多</span>
      </div>
      <div class="detail-more-wrapper">
        <span class="icon-cart">&nbsp;<del>30.00</del> 无限卡</span>
        <span class="icon-menu" @click="showCatelog()">&nbsp;目录</span>
      </div>
      <div class="bookInfo_more bookInfo_more_3children">
        <div class="bookInfo_more_rating">
          <div class="bookInfo_more_line1">
            <span class="bookInfo_more_line1_number">9.3</span>
            <span class="wr_rankBar wr_rankBar_Default wr_rankBar_9 bookInfo_score_rankBar"></span>
          </div>
          <div class="bookInfo_more_line2">15.6万人点评</div>
        </div>
        <div class="bookInfo_more_reading">
          <div class="bookInfo_more_line1">
            <span class="bookInfo_more_line1_number">53.8</span>万人
          </div>
          <div class="bookInfo_more_line2">阅读此书</div>
        </div>
        <a href="javascript:" class="bookInfo_more_addShelf wr_btn wr_btn_Big">加入书架</a>
      </div>
    </div>
  </div>
  <div class="wr_dialog" v-show = "ifShowDialog">
    <div class="wr_dialog_mask"></div>
    <div class="wr_dialog_container introDialogWrap">
      <span class="wr_dialog_closeButton" @click="hideDialog()">close</span>
      <div class="introDialog_content">
        <h3 class="introDialog_content_title">简介</h3>
        <div>
          <p class="introDialog_content_intro_para">{{desc}}</p>
        </div>
        <h3 class="introDialog_content_title">版权</h3>
        <div class="introDialog_content_pub_line">
          <span class="introDialog_content_pub_title">{{$t('detail.publisher')}}</span><span>人民文学出版社</span>
        </div>
        <div class="introDialog_content_pub_line">
          <span class="introDialog_content_pub_title">{{$t('detail.category')}}</span><span>2017年7月</span>
        </div>
        <div class="introDialog_content_pub_line">
          <span class="introDialog_content_pub_title">{{$t('detail.lang')}}</span><span>238,470</span>
        </div>
        <div class="introDialog_content_pub_line">
          <span class="introDialog_content_pub_title">{{$t('detail.ISBN')}}</span><span>当代文学榜-社会</span>
        </div>
      </div>
    </div>
  </div>
  <div class="wr_catelog" v-show = "ifShowCatelog">
    <div class="wr_catelog_mask"></div>
    <div class="wr_catelog_container">
      <span class="wr_catelog_closeButton" @click="hideCatelog()">close</span>
      <div class="introCatelog_content">
        <div class="book-detail-content-wrapper">
          <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
          <div class="book-detail-content-list-wrapper">
            <div class="loading-text-wrapper" v-if="!this.navigation">
              <span class="loading-text">{{$t('detail.loading')}}</span>
            </div>
            <div class="book-detail-content-item-wrapper">
              <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                  @click="read(item)">
                <div class="book-detail-content-navigation-text"
                    :class="{'is-sub': item.deep> 1}"
                    :style="itemStyle(item)"
                    v-if="item.label">{{item.label}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { ebookMixin } from '@/utils/mixin'
import { getLocalForage } from '@/utils/localForage'
import { px2rem } from '@/utils/utils'
export default {
  mixins: [ebookMixin],
  props: {
    // cover: String,
    title: String,
    author: String,
    desc: String
  },
  data () {
    return {
      ifShowDialog: false,
      ifShowCatelog: false
    }
  },
  methods: {
    showDialog () { this.ifShowDialog = true },
    hideDialog () { this.ifShowDialog = false },
    showCatelog () { this.ifShowCatelog = true },
    hideCatelog () { this.ifShowCatelog = false },
    doFlatNavigation (content, deep = 1) {
      const arr = []
      content.forEach(item => {
        item.deep = deep
        arr.push(item)
        if (item.subitems && item.subitems.length > 0) {
          arr.push(this.doFlatNavigation(item.subitems, deep + 1))
        }
      })
      return arr
    },
    itemStyle (item) {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
      }
    },
    read (item) {
      let bookItemKey = `${this.$route.query.category}|${this.$route.query.fileName}`
      getLocalForage(bookItemKey, (err, value) => {
        if (!err && value instanceof Blob) {
          this.$router.push({
            path: `/book/${bookItemKey}`,
            query: {
              navigation: item.href
            }
          })
        } else {
          // this.showToast(this.$t('shelf.downloadFirst'))
          this.$router.push({
            path: `/book/${bookItemKey}`,
            query: {
              navigation: item.href,
              opf: this.opf
            }
          })
        }
      })
    }
  },
  computed: {
    flatNavigation () {
      if (this.navigation && this.navigation.hasOwnProperty('toc')) {
        return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
      } else {
        return []
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";
  .readerBookInfo{
    margin-left: px2rem(24);
    margin-right: px2rem(24);
    margin-bottom: px2rem(24);
    padding-bottom: px2rem(40);
    box-sizing: border-box;
    .readerBookInfo_head {
        display: flex;
        padding-top: px2rem(60);
        @media (max-width: 1365px){
            position: relative;
            padding-bottom: 80px;
        }
        @media (max-width: 460px){
            padding-top: px2rem(30);
        }
        .wr_bookCover {
            display: block;
            flex: none;
            width: px2rem(120);
            height: px2rem(174);
            box-shadow: 0 px2rem(2) px2rem(16) rgba(0,0,0,.08);
            background: #d8d8d8;
            position: relative;
            img {
                vertical-align: top;
                width: 100%;
                height: 100%;
                background-color: #d8d8d8;
                -o-object-fit: cover;
                object-fit: cover;
            }
            .wr_bookCover_decor {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                &.wr_bookCover_gradientDecor {
                    background-image: linear-gradient(90deg,hsla(0,0%,63.1%,.25),rgba(21,21,20,.1) 1%,hsla(0,0%,100%,.15) 4%,hsla(0,0%,58%,.1) 8%,hsla(0,0%,89%,0) 57%,rgba(223,218,218,.03) 91%,rgba(223,218,218,.05) 98%,hsla(0,0%,100%,.1));
                    box-shadow: inset 0 0 0 0 rgba(0,0,0,.1);
                }
            }
        }
        .bookInfo_right {
            flex: auto;
            margin-left: px2rem(20);
            .bookInfo_title {
                margin-top: px2rem(4);
                color: #221014;
                font-family: "SourceHanSerifCN-Bold",PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif,STZhongsong;
                font-size: px2rem(24);
            }
            .bookInfo_author_container {
                margin-top: px2rem(9);
                line-height: px2rem(15);
                .bookInfo_author {
                    color: #4aabff;
                    font-family: "SourceHanSerifCN-Bold",PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif,STZhongsong;
                    font-size: px2rem(15);
                    line-height: px2rem(15);
                }
            }
            .bookInfo_intro {
                position: relative;
                cursor: pointer;
                text-align: justify;
                color: #6c6c6c;
                overflow: hidden;
                display: -webkit-box;
                display: -moz-box;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -moz-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                -webkit-text-size-adjust: none;
                box-orient: vertical;
                margin-top: px2rem(10);
                font-size: px2rem(13);
                // height: px2rem(46);
                line-height: px2rem(23);
                .bookInfo_intro_hasMore {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    color: #5d6573;
                    font-size: px2rem(13);
                    padding-left: px2rem(40);
                    background: linear-gradient(90deg, rgba(31, 32, 34, 0), #ffffff 50%, #ffffff);
                    transition: background-image .2s ease-in-out;
                }
            }
            .detail-more-wrapper {
              font-size: px2rem(13);
              line-height: px2rem(23);
              color: #878b90;
              .icon-cart{
                margin-right: px2rem(13);
              }
              .icon-menu:before {
                  vertical-align: -1px;
              }
            }
            .bookInfo_more {
                margin-top: px2rem(20);
                display: flex;
                align-items: center;
                justify-content: space-between;
                @media (max-width: 1365px){
                    position: absolute;
                    width: 100%;
                    left: 0;
                    bottom: 0;
                }
                .bookInfo_more_rating {
                    cursor: pointer;
                    @media (max-width: 767px){
                        flex: 1;
                        margin-right: px2rem(10);
                    }
                    .bookInfo_more_line1 {
                        line-height: 1;
                        color: #b2b4b8;
                        font-size: px2rem(11);
                        .bookInfo_more_line1_number {
                            font-size: px2rem(26);
                            font-family: 'DIN Medium';
                            vertical-align: - px2rem(5);
                            margin-right: px2rem(5);
                        }
                        .wr_rankBar_Default {
                            display: inline-block;
                            width: 100px;
                            height: 16px;
                            white-space: nowrap;
                            background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star.09aced99.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star.09aced99.png) 21px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star.09aced99.png) 42px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star.09aced99.png) 63px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star.09aced99.png) 84px 0 no-repeat;
                            background-size: 16px 16px;
                        }
                        .wr_rankBar_Default:after{
                          content: "";
                          display: inline-block;
                          vertical-align: top;
                          height: 16px;
                          width: 80px;
                          background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_selected_2x.bc27b76f.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_selected_2x.bc27b76f.png) 21px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_selected_2x.bc27b76f.png) 42px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_selected_2x.bc27b76f.png) 63px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_selected_2x.bc27b76f.png) 84px 0 no-repeat;
                          background-size: 16px 16px;
                        }
                    }
                    .bookInfo_more_line2 {
                        margin-top: px2rem(8);
                        font-size: px2rem(11);
                        word-break: break-all;
                        color: #8a8c90;
                        line-height: px2rem(13);
                        overflow: hidden;
                        height: px2rem(13);
                        display: -webkit-box;
                        display: -moz-box;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 1;
                        -moz-line-clamp: 1;
                        line-clamp: 1;
                        -webkit-box-orient: vertical;
                        -webkit-text-size-adjust: none;
                        box-orient: vertical;
                    }
                }
                .bookInfo_more_reading {
                    flex: 1;
                    .bookInfo_more_line1 {
                        line-height: 1;
                        color: #b2b4b8;
                        font-size: px2rem(11);
                        .bookInfo_more_line1_number {
                            font-size: px2rem(26);
                            margin-right: px2rem(4);
                            font-family: DIN-Medium;
                            vertical-align: -2px;
                        }
                    }
                    .bookInfo_more_line2 {
                      margin-top: px2rem(8);
                      font-size: px2rem(11);
                      word-break: break-all;
                      color: #8a8c90;
                      line-height: px2rem(13);
                      overflow: hidden;
                      height: px2rem(13);
                      text-overflow: ellipsis;
                      -webkit-line-clamp: 1;
                      -moz-line-clamp: 1;
                      line-clamp: 1;
                      -webkit-box-orient: vertical;
                      -webkit-text-size-adjust: none;
                      box-orient: vertical;
                    }
                }
                .bookInfo_more_addShelf {
                  align-self: center;
                  &.wr_btn {
                      position: relative;
                      display: inline-block;
                      height: px2rem(28);
                      padding: 0 px2rem(15);
                      min-width: px2rem(34);
                      line-height: px2rem(28);
                      font-size: px2rem(13);
                      font-weight: 500;
                      text-align: center;
                      background: linear-gradient(90deg,#0087fc,#28b7ff);
                      border-radius: px2rem(14);
                      color: #fff!important;
                      -webkit-user-select: none;
                      -moz-user-select: none;
                      -ms-user-select: none;
                      user-select: none;
                  }
                  &.wr_btn_Big {
                      height: px2rem(40);
                      line-height: px2rem(40);
                      font-size: px2rem(15);
                      border-radius: px2rem(20);
                      padding: 0 px2rem(28);
                  }
                  @media (max-width: 375px){
                    display: none!important;
                  }
                  @media (max-width: 767px){
                    display: none;
                  }
                }
            }
        }
    }
    .wr_dialog {
        position: fixed;
        z-index: 90;
        .wr_dialog_mask{
          position: fixed;
          z-index: 90;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.6);
        }
        .introDialogWrap {
            width: 80%;
            max-width: 500px;
            max-height: 80%;
            overflow: auto!important;
        }
        .wr_dialog_container {
            background-color: rgba(84,84,84,.8);
            -webkit-backdrop-filter: blur(40px);
            backdrop-filter: blur(40px);
            position: fixed;
            overflow: hidden;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 100;
            border-radius: 12px;
            text-align: center;
            .wr_dialog_closeButton {
                position: absolute;
                right: 16px;
                top: 16px;
                width: 20px;
                height: 20px;
                text-indent: 100%;
                white-space: nowrap;
                overflow: hidden;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/dialog_close.a5f40ec8.png) no-repeat;
                background-size: 100%;
            }
            .introDialog_content {
              box-sizing: border-box;
                padding: 40px 32px 32px;
                text-align: left;
                color: #b2b4b8;
                font-size: 14px;
                .introDialog_content_title {
                    font-family: "SourceHanSerifCN-Bold",PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif,STZhongsong;
                    font-size: 18px;
                    color: #eef0f4;
                    margin-bottom: 16px;
                    &:not(:first-child) {
                        margin-top: 32px;
                    }
                }
                .introDialog_content_intro_para {
                    line-height: 24px;
                    text-align: justify;
                }
                .introDialog_content_pub_line {
                    display: flex;
                    justify-content: space-between;
                    &:not(:last-child) {
                        margin-bottom: 12px;
                    }
                    .introDialog_content_pub_title {
                        color: #8a8c90;
                    }
                }
            }

        }
    }
    .wr_catelog{
      position: fixed;
      z-index: 90;
      .wr_catelog_mask{
        position: fixed;
        z-index: 90;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
      }
      .wr_catelog_container{
        width: 80%;
        max-width: 500px;
        max-height: 80%;
        overflow: auto!important;
        background-color: rgba(84,84,84,.8);
        -webkit-backdrop-filter: blur(40px);
        backdrop-filter: blur(40px);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 100;
        border-radius: 12px;
        text-align: center;
        .wr_catelog_closeButton {
          position: absolute;
          right: 16px;
          top: 16px;
          width: 20px;
          height: 20px;
          text-indent: 100%;
          white-space: nowrap;
          overflow: hidden;
          background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/dialog_close.a5f40ec8.png) no-repeat;
          background-size: 100%;
        }
        .introCatelog_content {
          box-sizing: border-box;
          padding: 40px 32px 32px;
          text-align: left;
          color: #b2b4b8;
          font-size: 14px;
          .book-detail-content-wrapper {
            width: 100%;
            box-sizing: border-box;
            .book-detail-content-title {
              font-family: "SourceHanSerifCN-Bold",PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif,STZhongsong;
              font-size: px2rem(20);
              font-weight: bold;
              padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
              box-sizing: border-box;
              text-align: center;
            }
            .book-detail-content-list-wrapper {
              padding: px2rem(10) px2rem(15);
              box-sizing: border-box;
              .loading-text-wrapper {
                width: 100%;
                .loading-text {
                  font-size: px2rem(14);
                  color: #666;
                }
              }
              .book-detail-content-item-wrapper {
                .book-detail-content-item {
                  padding: px2rem(15) 0;
                  font-size: px2rem(14);
                  line-height: px2rem(16);
                  color: #eee;
                  .book-detail-content-navigation-text {
                    width: 100%;
                    @include ellipsis;
                    &.is-sub {
                      color: #666;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
