<template>
  <div class="ebook-reader">
     <div class="ebook-reader-mask"
          @touchmove="move"
          @touchstart="moveStart"
         @touchend="moveEnd"
         @mousedown.left="onMouseEnter"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseEnd"
         @click="onMaskClick"></div>
    <div class="read-wrapper">
      <div id="read"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixin'
// import { getLocalForage } from '../../utils/localForage'
import {
  getTheme,
  getFontFamily,
  saveFontFamily,
  saveTheme,
  getFontSize,
  saveFontSize,
  saveMetadata,
  getLocation
} from '../../utils/localStorage'

global.ePub = Epub
export default {
  mixins: [ebookMixin],
  data () {
    return {
      havePaginate: false,
      isOnline: false
    }
  },
  methods: {
    moveStart (e) {
      // e.preventDefault()
      e.stopPropagation()
      // console.log('moveStart')
      this.touchStartX = e.changedTouches[0].clientX
      this.touchStartTime = e.timeStamp
    },
    move (e) {
      // console.log('move')
      // console.log('fosy', this.firstOffsetY)
      // console.log('fosx', this.firstOffsetX)
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.$store.commit('SET_OFFSETY', offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }

      let offsetX = 0
      if (this.firstOffsetX) {
        offsetX = e.changedTouches[0].clientX - this.firstOffsetX
        this.$store.commit('SET_OFFSETX', offsetX)
      } else {
        this.firstOffsetX = e.changedTouches[0].clientX
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd (e) {
      // console.log('moveEnd')
      this.$store.dispatch('setOffsetX', 0)
      this.$store.dispatch('setOffsetY', 0)
      this.firstOffsetX = 0
      this.firstOffsetY = 0
      const offsetX = e.changedTouches[0].clientX - this.touchStartX
      const time = e.timeStamp - this.touchStartTime
      // console.log('touchend', e)
      // console.log(offsetX)
      if (time < 500 && offsetX > 40) {
        this.prevPage()
      } else if (time < 500 && offsetX < -40) {
        this.nextPage()
      } else {
        // this.toggleMenuVisible()
      }
    },

    // 定义鼠标状态mouseMove：
    // 1- 鼠标进入
    // 2- 鼠标进入后移动
    // 3- 鼠标从移动状态松手
    // 4- 鼠标还原
    onMouseEnter (e) {
      // console.log('onMouseEnter')
      this.mouseMove = 1
      this.mouseStartTime = e.timeStamp
      this.touchStartX = e.clientX
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove (e) {
      // console.log('onMouseMove')
      if (this.mouseMove === 1) {
        this.mouseMove = 2
      } else if (this.mouseMove === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.$store.commit('SET_OFFSETY', offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
        let offsetX = 0
        if (this.firstOffsetX) {
          offsetY = e.clientX - this.firstOffsetX
          this.$store.commit('SET_OFFSETX', offsetX)
        } else {
          this.firstOffsetX = e.clientX
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd (e) {
      // console.log('onMouseEnd')
      if (this.mouseMove === 2) {
        this.$store.dispatch('setOffsetX', 0)
        this.$store.dispatch('setOffsetY', 0)
        this.firstOffsetX = 0
        this.firstOffsetY = 0
        this.mouseMove = 3
      }
      this.mouseEndTime = e.timeStamp
      const time = this.mouseEndTime - this.mouseStartTime
      if (time < 200) {
        this.mouseMove = 1
      }
      const offsetX = e.clientX - this.touchStartX
      // console.log('touchend', e)
      // console.log('offsetx', offsetX)
      if (time < 500 && offsetX > 40) {
        this.prevPage()
      } else if (time < 500 && offsetX < -40) {
        this.nextPage()
      } else {
        // this.toggleMenuVisible()
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMaskClick (e) {
      // console.log('onMaskClick')
      if (this.mouseMove === 2) {
      } else if (this.mouseMove === 1 || this.mouseMove === 4) {
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleMenuVisible()
        }
      }
      this.mouseMove = 4
    },
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
        this.refreshLocation()
      }
      this.hideMenuVisible()
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
        this.refreshLocation()
      }
      this.hideMenuVisible()
    },
    // 手势初始化
    initGuest () {
      this.rendition.on('touchstart', event => {
        // console.log('touchstart', event)
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        // console.log('touchend', event)
        // console.log(offsetX)
        if (time < 500 && offsetX > 40) {
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleMenuVisible()
        }
        event.preventDefault()
        event.stopPropagation()
      })
    },
    // 阅读器主题切换
    initTheme () {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      return defaultTheme
    },
    // 字体大小设置
    initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        fontSize = 16
        saveFontSize(this.fileName, fontSize)
      }
      return fontSize
    },
    // 字体设置
    initFontFamily () {
      let font = getFontFamily(this.fileName)
      if (!font) {
        font = 'Default'
        saveFontFamily(this.fileName, font)
      }
      return font
    },
    // book加载渲染
    initRendition () {
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        method: 'default'
        // flow: 'scrolled' //todo 上下滑动有兼容性问题
      })
      // 初始化
      Promise.all([
        this.setDefaultTheme(this.initTheme()),
        this.setDefaultFontSize(this.initFontSize()),
        this.setDefaultFontFamily(this.initFontFamily())
      ]).then(() => {
        this.switchTheme()
        // debugger
        if (this.$route.query.navigation) {
          this.display(this.$route.query.navigation)
        } else {
          const location = getLocation(this.fileName)
          if (location) {
            this.display(location)
          } else {
            this.display()
          }
        }
      })
      // 注册字体
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_FONTS_URL}/STKaiti.css`),
          contents.addStylesheet(`${process.env.VUE_APP_FONTS_URL}/STLiti.css`),
          contents.addStylesheet(`${process.env.VUE_APP_FONTS_URL}/STXingkai.css`),
          contents.addStylesheet(`${process.env.VUE_APP_FONTS_URL}/STZhongsong.css`)

        ]).then(() => {})
      })
    },
    parseBook () {
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
        saveMetadata(this.fileName, metadata)
      })
      if (this.isOnline) {
        this.book.coverUrl().then(url => {
          this.setCover(url)
        })
      } else {
        // console.log(this.book.loaded)
        this.book.loaded.cover.then(cover => {
          if (cover) {
            this.book.archive.createUrl(cover).then(url => {
              this.setCover(url)
            })
          }
        })
      }
      // 拆解响应中的树状结构转换成一维数组
      this.book.loaded.navigation.then(nav => {
        // console.log(nav)
        const navItem = (function flatten (arr) {
          return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
        })(nav.toc)

        function find (item, v = 0) { // v: level
          const parent = navItem.filter(it => it.id === item.parent)[0]
          return !item.parent ? v : (parent ? find(parent, ++v) : v)
        }

        navItem.forEach(item => {
          item.level = find(item)
          item.total = 0
          item.pagelist = []
          if (item.href.match(/^(.*)\.html$/)) {
            item.idhref = item.href.match(/^(.*)\.html$/)[1]
          } else if (item.href.match(/^(.*)\.xhtml$/)) {
            item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
          }
        })
        this.setNavigation(navItem)
      })

      // 加载完成
      this.book.ready.then(() => {
        this.setCurrentBook(this.book)
        // 返回分页locations
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        // console.log('sp', locations.length)
        if (locations) {
          this.setLocationLength(locations.length)
        }
        locations.forEach(location => {
          const loc = location.match(/\[(.*)\]!/)[1]
          this.navigation.forEach(item => {
            if (item.idhref && item.idhref.indexOf(loc) >= 0) {
              item.pagelist.push(location)
            }
          })
          let currentPage = 1
          this.navigation.forEach((item, index) => {
            if (index === 0) {
              item.page = 1
            } else {
              item.page = currentPage
            }
            currentPage += item.pagelist.length + 1
          })
        })
        // saveNavigation(this.fileName, this.navigation)
        this.setPagelist(locations)
        this.setBookAvailable(true)
        this.setIsPaginating(false)
        this.refreshLocation()
      })
    },
    initEpub (target) {
      this.book = new Epub(target)
      // console.log(this.book)
      this.setCurrentBook(this.book)
      // this.setIsPaginating(true)
      // this.setPaginate(this.$t('book.paginating'))
      this.initRendition()
      this.initGuest()
      this.parseBook()
    }
  },
  mounted () {
    if (this.$route.params.fileName.indexOf('|') > 0) {
      this.setFileName(
        this.$route.params.fileName.split('|').join('/'))
        .then(() => {
          // 实时下载电子书
          // console.log(`${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`)
          this.initEpub(`${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`)
          this.isOnline = false
        })
    } else {
      this.setFileName(this.$route.params.fileName)
        .then(() => {
          // getLocalForage(this.fileName, (err, blob) => {
          //   if (!err) {
          //     if (blob) {
          //       // 离线阅读模式
          //       this.isOnline = false
          //       this.initEpub(blob)
          //     } else {
          //       // 在线阅读模式
          //       this.isOnline = true
          //       const opf = this.$route.query.opf
          //       if (opf) {
          //         this.initEpub(opf)
          //       }
          //     }
          //   }
          // })
        })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

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
