<template>
<div class="ebook" ref="ebookView">
  <ebook-bookmark></ebook-bookmark>
  <ebook-title></ebook-title>
  <ebook-reader>
    <div id = "read"></div>
  </ebook-reader>
  <ebook-menu></ebook-menu>
</div>
</template>

<script>
import { ebookMixin } from '@/utils/mixin'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'

export default {
  name: 'book',
  mixins: [ebookMixin],
  components: {
    EbookBookmark,
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  methods: {
    restore () {
      this.$refs.ebookView.style.top = 0
      this.$refs.ebookView.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebookView.style.transition = ''
      }, 200)
    },
    move (offsetY) {
      this.$refs.ebookView.style.top = offsetY + 'px'
    },
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime / 60)
        }
      }, 1000)
    }
  },
  watch: {
    offsetY (v) {
      if (this.isPaginating !== null && this.isPaginating === false && !this.menuVisible) {
        if (v === 0) {
          this.restore()
        } else if (v > 0) {
          this.move(v)
        }
      }
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style scoped>
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
