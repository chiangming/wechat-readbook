<template>
  <div class="ebook-bookmark" ref="ebookBookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">
        {{text}}
      </div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="fixed && !isPaginating ? fixedStyle : {}">
      <book-mark :width="15" :height="35" :color="color" ref="bookmark"></book-mark>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BookMark from '@/components/ebook/bookmark/Bookmark'
import { realPx } from '@/utils/utils'
import { ebookMixin } from '../../../utils/mixin'
import { saveBookmark, getBookmark } from '../../../utils/localStorage'

const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  mixins: [ebookMixin],
  components: {
    BookMark
  },
  computed: {
    height () {
      return realPx(35)
    },
    threshold () {
      return realPx(55)
    },
    fixedStyle () {
      return {
        position: 'fixed',
        right: `${(window.innerWidth - this.$refs.ebookBookmark.clientWidth) / 2}px`,
        top: 0
      }
    }
  },
  watch: {
    offsetY (v) {
      if (this.settingVisible > 0 || this.menuVisible || this.isPaginating) {
        return
      }
      if (v >= this.height && v < this.threshold) { // 进入下拉临界
        this.setBookmark = false
        this.$refs.ebookBookmark.style.top = `${-v}px`
        if (this.$refs.iconDown.style.transform === 'rotate(180deg)') {
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }
        if (!this.isBookmark) {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
        } else {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
        }
      } else if (v >= this.threshold) { // 超越下拉临界
        this.setBookmark = true
        this.$refs.ebookBookmark.style.top = `${-v}px`
        if (this.$refs.iconDown.style.transform === 'rotate(0deg)' ||
            this.$refs.iconDown.style.transform === '') {
          this.$refs.iconDown.style.transform = 'rotate(180deg)'
        }
        if (!this.isBookmark) {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
        } else {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
        }
      } else if (v > 0 && v < this.height) {
        this.setBookmark = false
        if (!this.isBookmark) {
          this.text = this.$t('book.pulldownAddMark')
        } else {
          this.text = this.$t('book.pulldownDeleteMark')
        }
      } else if (v === 0) {
        if (!this.isBookmark) {
          if (this.setBookmark) {
            this.fixed = true
            this.setAndSaveBookmark()
          } else {
            this.fixed = false
          }
        } else {
          if (this.setBookmark) {
            this.fixed = false
            this.removeBookmark()
          } else {
            this.fixed = true
          }
        }
        setTimeout(() => {
          this.$refs.ebookBookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
          if (!this.fixed && this.color === BLUE) {
            this.color = WHITE
          }
          if (this.text === this.$t('book.releaseAddMark')) {
            this.text = this.$t('book.pulldownAddMark')
          }
          this.setBookmark = false
        }, 200)
      }
    },
    isBookmark (v) {
      this.fixed = v
      if (v) {
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  },
  data () {
    return {
      color: WHITE,
      text: '',
      setBookmark: false,
      fixed: false
    }
  },
  methods: {
    setAndSaveBookmark () {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '').replace('epubcfi(', '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
      const cfi = currentLocation.start.cfi
      this.currentBook.getRange(cfiRange).then(range => {
        let text = range.toString()
        text = text.replace(/\s\s/g, '')
        text = text.replace(/\r/g, '')
        text = text.replace(/\n/g, '')
        text = text.replace(/\t/g, '')
        text = text.replace(/\f/g, '')
        this.bookmark.push({
          cfi: cfi,
          text: text
        })
        this.setIsBookmark(true)
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    removeBookmark () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.fileName, this.bookmark)
      }
      this.setIsBookmark(false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(10);
    }
  }
</style>
