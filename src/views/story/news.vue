<template>
  <div class="view-news" style="position:relative;">
    <div class="header-wrapper" >
      <news-title @back="back"
                  :showShelf="false"
                  :title="title"
                  ref="title"></news-title>
    </div>
    <scroll class="content-wrapper"
            :top="42"
            :bottom="0"
            @onScroll="onScroll"
            ref="scroll">
             <iframe name="menuFrame" :src="srcUrl" id="mobsf" :onload="reinitIframe()" scrolling="no" height="100%" width="100%"></iframe>
    </Scroll>
  </div>
</template>

<script>
import NewsTitle from '@/components/mall/detail/detailTitle'
import Scroll from '@/components/common/scroll'
import { realPx } from '@/utils/utils'
export default {
  components: {
    NewsTitle,
    Scroll
  },
  data () {
    return {
      srcUrl: null,
      iframeHeight: 667,
      title: ''
    }
  },
  methods: {
    reinitIframe () {
      let iframe = document.getElementById('mobsf')
      try {
        let bHeight = iframe.contentWindow.document.body.scrollHeight
        let dHeight = iframe.contentWindow.document.documentElement.scrollHeight
        let minHeight = this.iframeHeight
        this.iframeHeight = Math.max(bHeight, dHeight, minHeight)
        iframe.height = this.iframeHeight
      // console.log(iframe.height)
      } catch (ex) {
      // console.log(ex)
      }
    },
    back () {
      this.$router.push('/story')
    },
    onScroll (offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow()
      } else {
        this.$refs.title.hideShadow()
      }
    }
  },
  mounted () {
  // console.log(this.$route.query.url)
    this.srcUrl = this.$route.query.url
    this.title = this.$route.query.title
    this.reinitIframe()
    let i = 0
    let task = setInterval(() => {
      i++
      this.reinitIframe()
      // console.log(i)
      if (i === 10) {
        clearInterval(task)
      }
    }, 2000)
    // function changeMobsfIframe () {
    //   const mobsf = document.getElementById('mobsf')
    //   const deviceWidth = document.body.clientWidth
    //   const deviceHeight = document.body.scrollHeight
    //   mobsf.style.width = deviceWidth + 'px' // 数字是页面布局宽度差值
    //   mobsf.style.height = deviceHeight + 'px' // 数字是页面布局高度差
    // }

    // changeMobsfIframe()

    // window.onresize = function () {
    //   changeMobsfIframe()
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.view-news{
  position:relative;
  height:100%;
  width:100%;
  background:white;
  overflow-y:scroll;
  overflow-x:hidden;
  .header-wrapper{
    position: absolute;
    top:0;
    width: 100%;
    height: px2rem(42);
    font-size: px2rem(20);
    color: #666;
  }
  #mobsf{
    overflow:visible;
  }
}
</style>
