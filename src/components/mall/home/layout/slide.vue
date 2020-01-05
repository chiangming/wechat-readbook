<template>
  <div class="slide-banner">
    <div class="banner-wrapper">
      <div class="slide-banner-scroll" ref="slide">
        <div class="slide-banner-wrapper" >
          <div class="slide-item page1">
            <book-item-page style="background: #17abe3" :data="slideData" ref="bip"></book-item-page>
          </div>
          <div class="slide-item page1">
            <book-item-page style="background: #ffc666" :data="slideData" ref="bip"></book-item-page>
          </div>
          <div class="slide-item page1">
            <book-item-page style="background: #409EFF" :data="slideData" ref="bip"></book-item-page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import MouseWheel from '@better-scroll/mouse-wheel'
import BookItemPage from '@/components/mall/home/layout/bookItemPage'

BScroll.use(Slide)
BScroll.use(MouseWheel)

export default {
  props: {
    slideData: Array,
    slideWidth: Number
  },
  data () {
    return {
      slide: null
    }
  },
  components: {
    BookItemPage
  },
  mounted () {
    this.$nextTick(function () {
      this.init()
    })
  },
  beforeDestroy () {
    this.slide.destroy()
  },
  methods: {
    init () {
      console.log(this.slideWidth)
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        slide: {
          loop: false,
          threshold: 0.5,
          stepX: this.slideWidth * 0.9,
          stepY: 100
        },
        useTransition: false,
        momentum: false,
        bounce: false,
        stopPropagation: true,
        mouseWheel: {
          speed: 2,
          invert: false,
          easeTime: 300
        }
      })
      console.log('slide', this.slide)
      this.slide.on('scrollEnd', this._onScrollEnd)
    },
    // nextPage () {
    //   this.slide.next()
    // },
    // prePage () {
    //   this.slide.prev()
    // },
    _onScrollEnd () {
      let pageIndex = this.slide.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
    }
  }
}
</script>
<style lang="scss" scoped>
  .slide-banner {
    .banner-wrapper {
      position:relative;
    }
    .slide-banner-scroll {
      min-height:1px;
      overflow:hidden
    }
    .slide-banner-wrapper {
      background: yellow;
      white-space:nowrap;
      font-size:0;
      .slide-item {
        display:inline-block;
        border:1px red dot-dash;
        font-size:26px;
        width:90%;
        overflow-y: hidden;
        &.page1 {
          background-color:#95B8D1;
        }
        &.page2 {
          background-color:#DDA789;
        }
        &.page3 {
          background-color:#C3D899;
        }
        &.page4 {
          background-color:#F2D4A7;
        }
      }
    }
  }
</style>
