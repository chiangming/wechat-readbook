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
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script>
import NewsTitle from '@/components/mall/detail/detailTitle'
import Scroll from '@/components/common/scroll'
import Toast from '@/components/common/toast'
import { realPx } from '@/utils/utils'
export default {
  components: {
    NewsTitle,
    Scroll,
    Toast
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
        let headroom = iframe.contentWindow.document.getElementsByClassName('headroom-wrapper')[0]
        if (headroom != null) {
          headroom.setAttribute('style', 'display: none !important;')
        }
        let chnv = iframe.contentWindow.document.getElementsByClassName('ch-nav')[0]
        if (chnv != null) {
          chnv.setAttribute('style', 'display: none !important;')
        }
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
    },
    showToast (text) {
      this.toastText = text
      this.$refs.toast.show()
    }
  },
  mounted () {
    let url = this.$route.query.url
    if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('www')) {
      this.showToast('访问域外网站')
      this.srcUrl = this.$route.query.url
      // console.log(this.srcUrl)
    } else {
      let proxyRootUrl = `${process.env.VUE_APP_REVERSE_PROXY_URL}`
      this.srcUrl = proxyRootUrl + this.$route.query.url
      // console.log(this.srcUrl)
      this.reinitIframe()
      let i = 0
      let task = setInterval(() => {
        i++
        this.reinitIframe()
        // console.log(i)
        if (i === 20) {
          clearInterval(task)
        }
      }, 1000)
    }
    this.title = this.$route.query.title
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
