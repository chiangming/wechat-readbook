<template>
  <div class="view-profile">
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
      <!-- <my-test class="content-slide"></my-test> -->
      <swiper :options="swiperOption" class="content-slide" ref="mySwiper">
        <swiper-slide>
          <div class="recommend-item">
            <div class="item-header">
              <div class="item-line1">为你推荐</div>
              <div class="item-line2">基于您的阅读历史计算 每日更新</div>
            </div>
            <div class="item-content-wrapper">
            <transition name="recommend-img">
            <div class="item-content" :key="recommendListIndex">
              <div class="item-object obj1">
                  <div class="item-object-img" @click="showBookDetail(recommendList[recommendListIndex][0])" >
                    <img :src="recommendList[recommendListIndex][0].cover">
                  </div>
              </div>
              <div class="item-object obj2">
                  <div class="item-object-img" @click="showBookDetail(recommendList[recommendListIndex][1])" >
                    <img :src="recommendList[recommendListIndex][1].cover">
                  </div>
              </div>
              <div class="item-object obj3">
                  <div class="item-object-img" @click="showBookDetail(recommendList[recommendListIndex][2])" >
                    <img :src="recommendList[recommendListIndex][2].cover">
                  </div>
              </div>
              <div class="item-object obj4">
                  <div class="item-object-img" @click="showBookDetail(recommendList[recommendListIndex][3])" >
                    <img :src="recommendList[recommendListIndex][3].cover">
                  </div>
              </div>
            </div>
             </transition>
            </div>
            <div class="item-footer">
              <div class = "item-button" @click="recommendListIndex++" v-if="recommendListIndex < recommendList.length-1">换一批</div>
              <div class = "item-button" @click="toMall()" v-else>查看更多专属推荐</div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide v-for="(item, index) in guessYouLikeList" :key="index+item.fileName">
          <div class="item-loading" v-if="item.loading">
            <div class="arc"></div>
            <h1><span>LOADING</span></h1>
          </div>
          <div class="guess-you-like-item" v-if="!item.loading">
            <div class="item-top">
              <div class="img-wrapper">
                <img class="img" v-lazy="item.cover" :key="item.cover">
              </div>
              <div class="title title-big" ref="title">{{item.title}}</div>
              <div class="author sub-title" ref="author">{{item.author}}</div>
            </div>
            <div class="item-bottom">
              <div class="result third-title" ref="result">{{resultText(item)}}<span class="icon-forward"></span></div>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-button" slot="button-next" v-show="ifShowBtn"></div>
      </swiper>
    </div>
    <div class="footer-wrapper">
      <common-footer :selectIndex="1" @firstPage="thisFirstPage()"></common-footer>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
// import MyTest from '../../components/common/test'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CommonSearch from '@/components/common/search'
import CommonFooter from '../../components/common/footer'
import { guessYouLike, recommend } from '@/api/mall'
import Toast from '@/components/common/toast'
import { detailMixin } from '@/utils/mixin'
// import { realPx } from '@/utils/utils'
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
  data () {
    return {
      ifShowSearchPage: false,
      ifShowHotSearch: false,
      ifInit: false,
      ifMounted: false,
      guessYouLikeList: [],
      recommendList: [[0, 1, 2, 3]],
      recommendListIndex: 0,
      toastText: '没有更多卡片',
      loadingItem: {
        loading: true
      },
      ifShowBtn: true,
      ifTouchEnd: false,
      ifListFinished: false,
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        // freeMode: true,
        spaceBetween: '5%',
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button'
        },
        debugger: true,
        on: {
          init: () => {
            // console.log('init')
            this.ifInit = true
          },
          transitionEnd: () => {
            // console.log('transitionEnd')
            if (this.ifTouchEnd && this.ifListFinished) {
              this.ifShowBtn = false
            } else {
              this.ifShowBtn = true
            }
            this.ifTouchEnd = false
          },
          reachEnd: () => {
            // console.log('reachEnd')
            this.ifTouchEnd = true
            if (this.ifInit && this.ifMounted && this.guessYouLikeList.length < 50) {
              if (this.guessYouLikeList.indexOf(this.loadingItem) === -1) {
                this.guessYouLikeList.push(this.loadingItem)
                var that = this
                setTimeout(function () {
                  guessYouLike().then(response => {
                    that.guessYouLikeList.pop()
                    if (response.status === 200 && response.data) {
                      let newResult = response.data.guessYourLike
                      newResult.forEach(item => {
                        that.guessYouLikeList.push(item)
                      })
                    }
                  })
                }, 2000)
              }
            } else if (this.ifInit && this.ifMounted && this.guessYouLikeList.length >= 50) {
              this.showToast(this.toastText)
              this.ifListFinished = true
            }
          }
        }
      }
    }
  },
  // computed: {
  //   itemHeight () {
  //     return (window.innerWidth * 0.4 - realPx(15)) * 350 / 250 + 'px'
  //   }
  // },
  methods: {
    toMall () {
      this.$router.push({
        path: '/mall/home'
      })
    },
    thisFirstPage () {
      this.$refs.mySwiper.swiper.slideTo(0, 500, true)
    },
    showToast (text) {
      this.toastText = text
      this.$refs.toast.show()
    },
    resultText (item) {
      if (item && item.type && item.result) {
        switch (item.type) {
          case 1:
            return this.$t('home.sameAuthor').replace('$1', item.result)
          case 2:
            return this.$t('home.sameReader').replace('$1', item.result)
          case 3:
            return this.$t('home.readPercent').replace('$1', item.percent).replace('$2', item.result)
        }
      }
    },
    arrTrans (num, arr) { // 一维数组转换为二维数组
      const iconsArr = []
      arr.forEach((item, index) => {
        const page = Math.floor(index / num)
        if (!iconsArr[page]) {
          iconsArr[page] = []
        }
        iconsArr[page].push(item)
      })
      return iconsArr
    }
  },
  mounted () {
    guessYouLike().then(response => {
      if (response.status === 200 && response.data) {
        this.guessYouLikeList = response.data.guessYourLike
      }
      this.ifMounted = true
    })
    recommend().then(response => {
      if (response.status === 200 && response.data) {
        this.recommendList = this.arrTrans(4, response.data.recommend)
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
  .view-profile{
    position: relative;
    width: 100%;
    height: 100%;
    background:#fff;
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
      overflow: hidden;
      .content-slide{
        position: absolute;
        top:50%;
        left:50%;
        height:100%;
        width:100%;
        padding:10px 0px 20px 0px;
        box-sizing: border-box;
        transform: translate(-50%,-50%);
        .swiper-slide {
            z-index: 1;
            text-align: center;
            font-size: 38px;
            font-weight: 700;
            width:80%!important;
            height:100%;
            box-sizing: border-box;
            background-color: #fff;
            border: #eee 1px solid;
            border-radius: 10px;
            overflow: hidden;
            .item-loading {
              .arc {
                position: absolute;
                margin: auto;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border-top: 2px solid #ffea29;
                border-left: 1px solid transparent;
                border-right: 1px solid transparent;
                animation: rt 2s infinite linear;
              }
              .arc::before {
                position: absolute;
                margin: auto;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border-top: 2px solid #8d29ff;
                border-left: 1px solid transparent;
                border-right: 1px solid transparent;
                animation: rt 4s infinite linear reverse;
                content: "";
              }
              .arc::after {
                position: absolute;
                margin: auto;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 0;
                height: 0;
                border-radius: 50%;
                border-top: initial;
                border-left: initial;
                border-right: initial;
                animation: cw 1s infinite;
                content: "";
                background: snow;
              }

              h1 {
                position: absolute;
                height: 40px;
                margin: auto;
                top: 200px;
                left: 0;
                right: 0;
                bottom: 0;
                text-transform: uppercase;
                text-align: center;
                letter-spacing: 0.1em;
                font-size: 14px;
                font-weight: lighter;
                color: black;
              }
              h1 span {
                display: none;
              }
              h1::after {
                animation: txt 2s infinite;
                content: "";
              }
            }
            .recommend-item {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
              .item-header {
                width:100%;
                flex: 1 1 15%;
                padding: px2rem(20) px2rem(25);
                text-align: left;
                .item-line1 {
                  line-height: px2rem(36);
                  font-size: px2rem(22);
                  font-weight: 100;
                  width:100%;
                  font-family: 'STZhongsong';
                }
                .item-line2 {
                  width:100%;
                  line-height: px2rem(22);
                  font-size: px2rem(13);
                  font-weight: 100;
                  color:gray;
                }
              }
              .item-content-wrapper{
                width:100%;
                flex: 1 1 70%;
                position: relative;
                .item-content {
                  width:100%;
                  height:100%;
                  position: absolute;
                  padding: 0 px2rem(25);
                  box-sizing: border-box;
                  .item-object {
                    width: 25%;
                    height: 100%;
                    display: inline-block;
                    padding: px2rem(5);
                    overflow: hidden;
                    box-sizing: border-box;
                    background: white;
                    @media (max-width: 890px){
                      display: block;
                      width: 42%;
                      height: 48%;
                      &.obj1{
                        position: absolute;
                        left:20px;
                        top:0;
                      }
                      &.obj2{
                        position: absolute;
                        right:20px;
                        top:0;
                      }
                      &.obj3{
                        position: absolute;
                        left:20px;
                        bottom:0;
                      }
                      &.obj4{
                        position: absolute;
                        right:20px;
                        bottom:0;
                      }
                    }
                    .item-object-img{
                      height:100%;
                      width:100%;
                      background: #f4f4f4;
                      overflow: hidden;
                      img {
                        width:100%;
                        height: 100%;
                      }
                    }
                  }
                }
              }
              .item-footer {
                width:100%;
                flex: 1 1 15%;
                position: relative;
                .item-button{
                  line-height: px2rem(22);
                  font-size: px2rem(13);
                  font-weight: 100;
                  color:#339cee;
                  position: absolute;
                  top:50%;
                  left:50%;
                  transform: translate(-50%,-50%)
                }
              }
            }
            .guess-you-like-item{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
              .item-top{
                width:100%;
                height:46%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-top:40px;
                box-sizing: border-box;
                align-items: center;
                .img-wrapper {
                  flex-grow: 0;
                  height:px2rem(145);
                  width:px2rem(100);
                  overflow: hidden;
                  // padding: px2rem(10) px2rem(10) px2rem(10) 0;
                  box-sizing: border-box;
                  // display:flex;
                  // align-items:center;
                  // justify-content:center;
                  img {
                    width: 100%;
                    height:100%;
                    // display:block;
                  }
                }
                .title {
                  flex-grow: 0;
                  flex-shrink: 0;
                  line-height: px2rem(36);
                  font-size: px2rem(22);
                  width:100%;
                  font-family: 'STZhongsong';
                }
                .author {
                  flex-grow: 0;
                  flex-shrink: 0;
                  font-family: 'STZhongsong';
                  width:100%;
                  line-height: px2rem(15);
                  font-size: px2rem(15);
                  font-weight: 100;
                }
              }
              .item-bottom{
                width:100%;
                height: 54%;
                position: relative;
                .result{
                  position: absolute;
                  bottom:40px;
                  width:100%;
                  text-align: center;
                }
              }
            }
        }
        // .swiper-slide:first-child {
        //     z-index: 1;
        //     text-align: center;
        //     font-size: 38px;
        //     font-weight: 700;
        //     width:5%!important;
        //     height:100%;
        //     box-sizing: border-box;
        //     background-color: #aaa;
        //     border: #eee 1px solid;
        //     border-radius: 10px;
        // }
        .swiper-button{
          z-index: 2;
          position:absolute;
          bottom: 20px;
          right:10px;
          outline: none;
          background: #f3f3fe;
          background-image:url('../../assets/images/icon-right.png');
          border-radius: 25px;
          height:50px;
          width:50px;
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

  @keyframes rt {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes cw {
  0% {
    width: 0;
    height: 0;
  }
  75% {
    width: 40px;
    height: 40px;
  }
  100% {
    width: 0;
    height: 0;
  }
}
@keyframes txt {
  0% {
    content: "LOADING.";
  }
  50% {
    content: "LOADING..";
  }
  100% {
    content: "LOADING...";
  }
}

.item-content{
            perspective: 1000;
            -webkit-perspective: 1000;
            transition: all 1.3s linear 0s;

            &.recommend-img-enter{
                .obj1{transform: rotateY(-90deg);opacity: 0;}
                .obj2{transform: rotateY(-90deg);opacity: 0;}
                .obj3{transform: rotateY(-90deg);opacity: 0;}
                .obj4{transform: rotateY(-90deg);opacity: 0;}
             }
             &.recommend-img-enter-to{
                .obj1{transform: rotateY(0deg);opacity: 1;}
                .obj2{transform: rotateY(0deg);opacity: 1;}
                .obj3{transform: rotateY(0deg);opacity: 1;}
                .obj4{transform: rotateY(0deg);opacity: 1;}
             }
             &.recommend-img-enter-active{
                .obj1{transition: all .3s linear .4s;}
                .obj2{transition: all .3s linear .6s;}
                .obj3{transition: all .3s linear .8s;}
                .obj4{transition: all .3s linear 1s;}
            }

             &.recommend-img-leave{
                .obj1{transform: rotateY(0deg);opacity: 1;}
                .obj2{transform: rotateY(0deg);opacity: 1;}
                .obj3{transform: rotateY(0deg);opacity: 1;}
                .obj4{transform: rotateY(0deg);opacity: 1;}
             }
             &.recommend-img-leave-to{
                .obj1{transform: rotateY(90deg);opacity: 0;}
                .obj2{transform: rotateY(90deg);opacity: 0;}
                .obj3{transform: rotateY(90deg);opacity: 0;}
                .obj4{transform: rotateY(90deg);opacity: 0;}
             }

              &.recommend-img-leave-active{
                .obj1{transition: all .3s linear .1s;}
                .obj2{transition: all .3s linear .3s;}
                .obj3{transition: all .3s linear .5s;}
                .obj4{transition: all .3s linear .7s;}
              }
}
</style>
