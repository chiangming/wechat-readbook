<template>
  <div class="ebook-reader">
   <div class="read-wrapper">
      <div id="read"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Epub from 'epubjs'
// import { mapGetters, mapActions } from 'vuex'    //使用mixin替换mapGetters和mapActions
import { ebookMixin } from '@/utils/mixin'

global.ePub = Epub

export default {
  name: 'EBookReader',
  mixins: [ebookMixin],
  computed: {
    // ...mapGetters(['fileName', 'menuVisible'])
  },
  methods: {
    // ...mapActions(['setMenuVisible']),
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    initEpub () {
      const url = 'http://103.14.34.148:9000/epub/' + this.fileName.split('|').join('/') + '.epub'
      console.log(url)
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      console.log(this.rendition)
      this.rendition.display()

      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        if (time < 500 && offsetX > 40) {
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        event.preventDefault() // 禁用默认方法调用
        event.stopPropagation() // 禁止事件传播
      })
      this.rendition.hooks.content.register(contents => {
        contents.addStylesheet('http://103.14.34.148:9000/fonts/%E5%8D%8E%E6%96%87%E4%B8%AD%E5%AE%8B.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/%E5%8D%8E%E6%96%87%E6%A5%B7%E4%BD%93.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/%E5%8D%8E%E6%96%87%E8%A1%8C%E6%A5%B7.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/%E5%8D%8E%E6%96%87%E9%9A%B6%E4%B9%A6.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/cabin.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/daysOne.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/montserrat.css')
        contents.addStylesheet('http://103.14.34.148:9000/fonts/tangerine.css')
      })
    }
  },
  mounted () {
    const fileName = this.$route.params.fileName
    console.log(fileName)
    // this.$store.dispatch('setFileName', fileName).then(()
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global.scss";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      z-index: 150;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
