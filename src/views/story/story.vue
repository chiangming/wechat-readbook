<template>
  <div class="view-story">
    <div class="header-wrapper">
    <common-search :ifShowSearchPage.sync="ifShowSearchPage"
                  :ifShowHotSearch.sync="ifShowHotSearch"
                  :isDataEmpty="false"
                   ref="searchBar">
                   <template v-slot:button="slotProps">
                      <div class="btn-edit-wrapper" @click="toMall" v-if="slotProps.ifShow">
                        <span class="btn-edit-text">书城</span>
                      </div>
                    </template>
                   </common-search>
    </div>
    <div class="content-wrapper">
      <swiper :options="swiperOptionv" class="v-slide-wrapper">
        <swiper-slide class="v-slide slide-loader-top" v-if="ifLoading">
          <svg width="100%" height="50px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet" style="left: 50%; top: 50%; position: absolute; transform: translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0);">
              <path stroke="#ededed" id="outline" fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"/>
              <path id="outline-bg" opacity="0.05" fill="none" stroke="#ededed" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"/>
          </svg>
        </swiper-slide>
        <swiper-slide class="v-slide" v-if="ifLoaded">
          <div class="loaded-text">为您更新{{dataNumber}}条内容</div>
        </swiper-slide>
        <swiper-slide class="v-slide">
          <div class="top-text">
            <div class="top-text-1">继续阅读</div>
            <div class="top-text-2">朋友的想法<span class="icon-forward"></span></div>
          </div>
          <swiper :options="swiperOptionh" class="h-slide-wrapper">
            <swiper-slide class="h-slide">
              <div class="book-item-wrapper" @click="showBookDetail(bookList[0])">
                <div class="book-cover">
                  <img class="book-cover-img" v-lazy="bookList[0].cover">
                </div>
                <div class="book-title">{{bookList[0].title}}</div>
                <div class="book-sub-title">编辑推荐</div>
              </div>
            </swiper-slide>
            <swiper-slide class="h-slide">
              <div class="book-item-wrapper" @click="showBookDetail(bookList[1])">
                <div class="book-cover">
                  <img class="book-cover-img" v-lazy="bookList[1].cover">
                </div>
                <div class="book-title">{{bookList[1].title}}</div>
                <div class="book-sub-title">免费好书</div>
              </div>
            </swiper-slide>
            <swiper-slide class="h-slide">
              <div class="book-item-wrapper" @click="showBookDetail(bookList[2])">
                <div class="book-cover">
                  <img class="book-cover-img" v-lazy="bookList[2].cover">
                </div>
                <div class="book-title">{{bookList[2].title}}</div>
                <div class="book-sub-title">每日精选</div>
              </div>
            </swiper-slide>
            <swiper-slide class="h-slide">
              <div class="book-item-wrapper" @click="showBookDetail(bookList[3])">
                <div class="book-cover">
                  <img class="book-cover-img" v-lazy="bookList[3].cover">
                </div>
                <div class="book-title">{{bookList[3].title}}</div>
                <div class="book-sub-title">最近飙升</div>
              </div>
            </swiper-slide>
            <swiper-slide class="h-slide">
              <div class="book-item-wrapper" @click="toMall()">
                <div class="book-cover">
                  <span class="icon-add"></span>
                </div>
                <div class="book-title"> </div>
                <div class="book-sub-title"> </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-h" slot="pagination"></div>
          </swiper>
        </swiper-slide>
        <swiper-slide class="v-slide" v-for="(item,index) in newsList" :key="newsKeyPrefix+index">
          <swiper :options="swiperOptionNews" class="news-slide-wrapper" ref="mySwiper">
            <swiper-slide class="new-slide-item" >
              <span @click="relocated(item.url)" class="news-item-link"></span>
              <div class="news-item-top2" v-if="item.multi_imgs.length>=3">
                <div class ="news-title-wrapper">
                  <div class="news-title">{{item.title}}</div>
                </div>
                <div class="news-img-wrapper">
                  <img class="news-img" :src="item.multi_imgs[0]">
                  <img class="news-img" :src="item.multi_imgs[1]">
                  <img class="news-img" :src="item.multi_imgs[2]">
                </div>
              </div>
              <div class="news-item-top" v-else>
                <div class ="news-title-wrapper">
                  <div class="news-title">{{item.title}}</div>
                </div>
                <div class="news-img-wrapper">
                  <img class="news-img" :src="item.img">
                </div>
              </div>
              <div class="news-item-bottom">
                <div class ="news-tags-wrapper">
                  <div class="news-tags">{{item.category2_chn}} &nbsp;&nbsp;#{{item.tag_label[0][0]}}</div>
                </div>
              </div>
            </swiper-slide>
            <swiper-slide class="new-slide-button" :key="newsKeyPrefix+index+buttonKeySuffix">
              <div class="news-btn-text" @click="removeNewsItem(item)">不感兴趣</div>
            </swiper-slide>
          </swiper>
        </swiper-slide>
         <swiper-slide class="v-slide slide-loader" v-if="true">
            <!-- <div class="loader">
            <div class="loader-inner line-spin-fade-loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div> -->
          <div class="loadEffect">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
         </swiper-slide>
        <div class="swiper-pagination swiper-pagination-v" slot="pagination"></div>
      </swiper>
    </div>
    <div class="footer-wrapper">
      <common-footer :selectIndex="3"></common-footer>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
// import MyTest from '../../components/common/test'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CommonSearch from '@/components/common/search'
import CommonFooter from '../../components/common/footer'
import Toast from '@/components/common/toast'
import { detailMixin } from '@/utils/mixin'
import { getNews, guessYouLike } from '@/api/mall'
import '@/assets/styles/swipe.css'

export default {
  name: 'profile',
  mixins: [detailMixin],
  components: {
    CommonSearch,
    CommonFooter,
    Toast,
    swiper,
    swiperSlide
  },
  watch: {
    ifNoMoreNews (newValue, oldValue) {
      if (newValue === true) {
        this.showToast('已经没有新内容了')
      }
    }
  },
  data () {
    return {
      newsKeyPrefix: 'news-',
      slideKeySuffix: '-slide',
      buttonKeySuffix: '-btn',
      ifShowSearchPage: false,
      ifShowHotSearch: false,
      ifInit: false,
      ifMounted: false,
      ifLoading: false,
      ifTailLoading: false,
      ifLoaded: false,
      ifNoMoreNews: false,
      toastText: '========',
      newsPageIndex: 0,
      dataNumber: 0,
      bookList: [],
      newsList: [],
      swiperOptionv: {
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
        on: {
          reachBeginning: () => {
          // console.log('reachBeginning')
            if (!this.ifLoading && this.ifMounted && !this.ifNoMoreNews) {
              this.ifLoading = true
              this.newsPageIndex++
              let res = []
              getNews(this.newsPageIndex).then(response => {
                if (response.status === 200 && response.data) {
                // console.log(response.data.data)
                  if (response.data.datanum === 0 || response.data.data.length === 0) {
                    this.ifNoMoreNews = true
                  }
                  res = response.data.data
                  this.dataNumber = response.data.datanum
                } else {
                  this.ifNoMoreNews = true
                }
                setTimeout(() => {
                  this.ifLoading = false
                  this.ifLoaded = true
                  this.newsList.unshift(...res)
                }, 1500)
                setTimeout(() => {
                  this.ifLoaded = false
                }, 3000)
              })
            }
          },
          reachEnd: () => {
          // console.log('reachEnd')
            if (!this.ifTailLoading && this.ifMounted && !this.ifNoMoreNews) {
              this.ifTailLoading = true
              this.newsPageIndex++
              let res = []
              getNews(this.newsPageIndex).then(response => {
                if (response.status === 200 && response.data) {
                // console.log(response.data.data)
                  if (response.data.datanum === 0 || response.data.data.length === 0) {
                    this.ifNoMoreNews = true
                  }
                  res = response.data.data
                } else {
                  this.ifNoMoreNews = true
                }
              })
              setTimeout(() => {
                this.ifTailLoading = false
                this.newsList.push(...res)
              }, 2000)
            }
          }
        }
      },
      swiperOptionh: {
        spaceBetween: 0,
        slidesPerView: 'auto'
      },
      swiperOptionNews: {
        spaceBetween: 0,
        slidesPerView: 'auto'
      }
    }
  },
  methods: {
    toMall () {
      this.$router.push({
        path: '/mall/home'
      })
    },
    showToast (text) {
      this.toastText = text
      this.$refs.toast.show()
    },
    relocated (url) {
      window.location.href = url
    },
    removeNewsItem (item) {
    // console.log('remove!!!!')
      this.newsList.splice(this.newsList.indexOf(item), 1)
      for (let index in this.newsList) {
        this.$refs.mySwiper[index].swiper.slideTo(0, 500, true)
      }
    }
  },
  mounted () {
    getNews(0).then(response => {
      if (response.status === 200 && response.data) {
        if (response.data && response.data.data) {
          this.newsList.push(...response.data.data)
        }
      }
      this.ifMounted = true
    })
    guessYouLike().then(response => {
      if (response.status === 200 && response.data) {
        this.bookList = response.data.guessYourLike
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
  .view-story{
    position: relative;
    width: 100%;
    height: 100%;
    background:#bbbbbb;
    .header-wrapper{
      position:absolute;
      top:0;
      height: px2rem(52);
      width:100%;
    }
    .content-wrapper{
      position:absolute;
      top: px2rem(52);
      bottom: px2rem(48);
      left:0;
      right:0;
      width:100%;
      height: calc(100% - px2rem(100));
      overflow: hidden;
      .v-slide-wrapper{
        height: 100%;
        width:100%;
        box-sizing: border-box;
        .v-slide{
        height: auto;
        width: 100%;
        box-sizing: border-box;
        background:#bbbbbb;
        .loaded-text{
          line-height: px2rem(30);
          font-size: px2rem(15);
          color:white;
          text-align: center;
          height:px2rem(30);
        }
        .top-text{
          height:px2rem(30);
          width: 100%;
          background: #fff;
          padding:2px 10px;
          box-sizing: border-box;
          .top-text-1{
            height: 100%;
            float:left;
            line-height: px2rem(35);
            font-size: px2rem(20);
            color:black;
          }
          .top-text-2{
            height: 100%;
            float: right;
            line-height: px2rem(26);
            font-size: px2rem(12);
            color:gray;
          }
          &:after{
            clear:both;
          }
        }
        .h-slide-wrapper{
          height: 100%;
          width:100%;
          background: white;
          box-sizing: border-box;
          .h-slide{
            box-sizing: border-box;
            height: px2rem(200);
            width:33%;
            background: #bbbbbb;
            .book-item-wrapper{
              height:100%;
              width:100%;
              background:white;
              padding:10px;
              box-sizing: border-box;
              .book-cover {
                width:100px;
                height:125px;
                margin:0 auto;
                border: solid 1px #ccc;
                position: relative;;
                .book-cover-img{
                  height:100%;
                  width:100%;
                }
                .icon-add {
                  position: absolute;
                  display: block;
                  top:50%;
                  left:50%;
                  transform: translate(-50%,-50%);
                  font-size: px2rem(40);
                  color: #ccc;
                }
              }
              .book-title{
                width:100px;
                margin:0 auto;
                line-height: px2rem(30);
                font-size: px2rem(16);
                color:black;
                height: px2rem(30);
                text-overflow: ellipsis;
                overflow: hidden;
                -webkit-line-clamp: 1; /* 限制在一个块元素显示的文本的行数 */
                -webkit-box-orient: vertical;
                word-break: break-all;
                white-space: nowrap;
                text-align: left;
              }
              .book-sub-title{
                line-height: px2rem(12);
                font-size: px2rem(12);
                color:gray;
                width:100px;
                margin:0 auto;
                text-align: left;
              }
            }
          }
        }
        .news-slide-wrapper{
          height: 100%;
          width:100%;
          box-sizing: border-box;

          .new-slide-item{
            height: 100%;
            width:100%;
            overflow: hidden;
            box-sizing: border-box;
            background:white;
            .news-item-link{
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              -webkit-tap-highlight-color: rgba(0,0,0,0)!important;
              -webkit-tap-highlight-color: transparent!important;
            }
            .news-item-top{
              height:85px;
              width:100%;
              display: flex;
              flex-direction: row;
              .news-title-wrapper{
                flex:1 1 66%;
                width:66%;
                height: 100%;
                box-sizing: border-box;
                padding:px2rem(10) 0 px2rem(10) px2rem(10);
                .news-title{
                  font-size:px2rem(18);
                  line-height:px2rem(20);
                  color: black;
                  text-align: left;
                }
              }
              .news-img-wrapper{
                flex:1 1 33%;
                width:33%;
                height:200px;
                box-sizing: border-box;
                padding:px2rem(10);
                .news-img {
                  display: inline-block;
                  width:100%;
                  border-radius: px2rem(5);
                  object-fit: contain;
                }
              }
            }
            .news-item-top2{
              width:100%;
              height:200px;
              display:flex;
              flex-direction:column;
              .news-title-wrapper{
                width:100%;
                flex: 1 1 25%;
                box-sizing: border-box;
                padding:px2rem(10) px2rem(10) 0 px2rem(10);
                .news-title{
                  font-size:px2rem(18);
                  line-height:px2rem(20);
                  color: black;
                  text-align: left;
                }
              }
              .news-img-wrapper{
                width:100%;
                // height:100%;
                flex:1 1 75%;
                box-sizing: border-box;
                padding:px2rem(10);
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .news-img {
                  display: inline-block;
                  width:32%;
                  border-radius: px2rem(5);
                  object-fit: contain;
                }
              }
            }
            .news-item-bottom{
              height:27px;
              width:100%;
              .news-tags-wrapper{
                width: 100%;
                height:100%;
                padding: 0 px2rem(10);
                box-sizing: border-box;
                .news-tags{
                  font-size:px2rem(12);
                  line-height:px2rem(26);
                  color: #bbbbbb;
                  text-align: left;
                  border-bottom: #f7f7f7 1px solid;
                }
              }
            }
          }
          .new-slide-button{
            height: 100%;
            width:30%!important;
            background: #bbbbbb;
            position: relative;
            .news-btn-text{
              position: absolute;
              width:100%;
              height:px2rem(26);
              left:50%;
              top:50%;
              transform: translate(-50%,-50%);
              font-size:px2rem(12);
              line-height:px2rem(26);
              color: white;
              text-align:center;
            }
          }
        }
      }
      }
    }
    .footer-wrapper{
      position: absolute;
      bottom: 0;
      height: px2rem(48);
      width:100%;
    }
  }

  .slide-loader-top{
    box-sizing: border-box;
    width:100%;
    min-height:50px;
  }

  .loadEffect {
    width: 100px;
    height: 100px;
    position: relative;
    margin: 0 auto;
    transform: scale(0.3);
    span {
      display: inline-block;
      width: 30px;
      height: 10px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      background: white;
      position: absolute;
      animation: load 1.04s ease infinite;
      -webkit-animation: load 1.04s ease infinite;
    }
    span:nth-child(1) {
      left: 0;
      top: 50%;
      margin-top: -5px;
      animation-delay: 0.13s;
    }
    span:nth-child(2) {
        left: 10px;
        top: 20px;
        transform: rotate(45deg);
        animation-delay: 0.26s;
    }
     span:nth-child(3) {
        left: 50%;
        top: 10px;
        margin-left: -15px;
        transform: rotate(90deg);
        animation-delay: 0.39s;
    }
    span:nth-child(4) {
        top: 20px;
        right: 10px;
        transform: rotate(135deg);
        animation-delay: 0.52s;
    }
    span:nth-child(5) {
        right: 0;
        top: 50%;
        margin-top: -5px;
        transform: rotate(180deg);
        animation-delay: 0.65s;
    }
    span:nth-child(6) {
        right: 10px;
        bottom: 20px;
        transform: rotate(225deg);
        animation-delay: 0.78s;
    }
    span:nth-child(7) {
        bottom: 10px;
        left: 50%;
        margin-left: -15px;
        transform: rotate(270deg);
        animation-delay: 0.91s;
    }
    span:nth-child(8) {
        bottom: 20px;
        left: 10px;
        transform: rotate(315deg);
        animation-delay: 1.04s;
    }
}
 @keyframes load {
  0% { opacity: 1; }
  100% { opacity: 0.2;}
}

//   .slide-loader{
//     box-sizing: border-box;
//     display: flex;
//     flex: 0 1 auto;
//     flex-direction: column;
//     flex-grow: 1;
//     flex-shrink: 0;
//     flex-basis: 25%;
//     align-items: center;
//     justify-content: center;
//     .line-spin-fade-loader {
//         position: relative;
//     }
//     .line-spin-fade-loader > div:nth-child(1) {
//         top: 20px;
//         left: 0;
//         -webkit-animation: line-spin-fade-loader 1.2s 0.12s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.12s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div:nth-child(2) {
//         top: 13.63636px;
//         left: 13.63636px;
//         -webkit-transform: rotate(-45deg);
//         -ms-transform: rotate(-45deg);
//         transform: rotate(-45deg);
//         -webkit-animation: line-spin-fade-loader 1.2s 0.24s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.24s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div:nth-child(3) {
//         top: 0;
//         left: 20px;
//         -webkit-transform: rotate(90deg);
//         -ms-transform: rotate(90deg);
//         transform: rotate(90deg);
//         -webkit-animation: line-spin-fade-loader 1.2s 0.36s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.36s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div:nth-child(4) {
//         top: -13.63636px;
//         left: 13.63636px;
//         -webkit-transform: rotate(45deg);
//         -ms-transform: rotate(45deg);
//         transform: rotate(45deg);
//         -webkit-animation: line-spin-fade-loader 1.2s 0.48s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.48s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div:nth-child(5) {
//         top: -20px;
//         left: 0;
//         -webkit-animation: line-spin-fade-loader 1.2s 0.6s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.6s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div:nth-child(6) {
//         top: -13.63636px;
//         left: -13.63636px;
//         -webkit-transform: rotate(-45deg);
//         -ms-transform: rotate(-45deg);
//         transform: rotate(-45deg);
//         -webkit-animation: line-spin-fade-loader 1.2s 0.72s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.72s infinite ease-in-out;
//     }
//         .line-spin-fade-loader > div:nth-child(7) {
//         top: 0;
//         left: -20px;
//         -webkit-transform: rotate(90deg);
//         -ms-transform: rotate(90deg);
//         transform: rotate(90deg);
//         -webkit-animation: line-spin-fade-loader 1.2s 0.84s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.84s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div:nth-child(8) {
//         top: 13.63636px;
//         left: -13.63636px;
//         -webkit-transform: rotate(45deg);
//         -ms-transform: rotate(45deg);
//         transform: rotate(45deg);
//         -webkit-animation: line-spin-fade-loader 1.2s 0.96s infinite ease-in-out;
//         animation: line-spin-fade-loader 1.2s 0.96s infinite ease-in-out;
//     }
//     .line-spin-fade-loader > div {
//         background-color: #fff;
//         width: 4px;
//         height: 35px;
//         border-radius: 2px;
//         margin: 2px;
//         -webkit-animation-fill-mode: both;
//         animation-fill-mode: both;
//         position: absolute;
//         width: 5px;
//         height: 15px;
//     }
//     @-webkit-keyframes line-spin-fade-loader {
//   50% {
//     opacity: 0.3; }

//   100% {
//     opacity: 1; } }

// @keyframes line-spin-fade-loader {
//   50% {
//     opacity: 0.3; }

//   100% {
//     opacity: 1; } }
//   }

  #outline {
    stroke-dasharray: 2.42777px, 242.77666px;
    stroke-dashoffset: 0;
    -webkit-animation: anim 1.6s linear infinite;
    animation: anim 1.6s linear infinite;
}
@-webkit-keyframes anim {
    12.5% {
        stroke-dasharray: 33.98873px, 242.77666px;
        stroke-dashoffset: -26.70543px;
    }
    43.75% {
        stroke-dasharray: 84.97183px, 242.77666px;
        stroke-dashoffset: -84.97183px;
    }
    100% {
        stroke-dasharray: 2.42777px, 242.77666px;
        stroke-dashoffset: -240.34889px;
    }
}
@keyframes anim {
    12.5% {
        stroke-dasharray: 33.98873px, 242.77666px;
        stroke-dashoffset: -26.70543px;
    }
    43.75% {
        stroke-dasharray: 84.97183px, 242.77666px;
        stroke-dashoffset: -84.97183px;
    }
    100% {
        stroke-dasharray: 2.42777px, 242.77666px;
        stroke-dashoffset: -240.34889px;
    }
}
.check-out {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    font-size: 2rem;
    color: #fff;
}
</style>
