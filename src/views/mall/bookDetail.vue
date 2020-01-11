<template>
  <div class="book-detail">
    <detail-title @back="back"
                  :showShelf="true"
                  ref="title"></detail-title>
    <scroll class="content-wrapper"
            :top="42"
            :bottom="52"
            @onScroll="onScroll"
            ref="scroll">
      <read-book-info :title="title"
                 :author="author"
                 :desc="desc"></read-book-info>
      <reader-top-review></reader-top-review>
      <div class="book-detail-content-wrapper">
        <div id="preview" ref="preview"></div>
      </div>
    </scroll>
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
      <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
import DetailTitle from '@/components/mall/detail/detailTitle'
import ReadBookInfo from '@/components/mall/detail/readBookInfo'
import ReaderTopReview from '@/components/mall/detail/readerTopReview'
import Scroll from '@/components/common/scroll'
import Toast from '@/components/common/toast'
import { removeFromBookShelf, addToShelf } from '@/utils/book'
import { detail } from '@/api/mall'
import { px2rem, realPx } from '@/utils/utils'
import { getLocalForage } from '@/utils/localForage'
import { getLocalStorage } from '@/utils/localStorage'
import Epub from 'epubjs'
import { ebookMixin, detailMixin } from '@/utils/mixin'

global.ePub = Epub

export default {
  mixins: [ebookMixin, detailMixin],
  components: {
    DetailTitle,
    Scroll,
    ReadBookInfo,
    ReaderTopReview,
    Toast
  },
  computed: {
    desc () {
      if (this.description) {
        return this.description.substring(0, 300)
      } else {
        return '暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介暂无简介'
      }
    },
    flatNavigation () {
      if (this.navigation) {
        return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
      } else {
        return []
      }
    },
    lang () {
      return this.metadata ? this.metadata.language : '-'
    },
    isbn () {
      return this.metadata ? this.metadata.identifier : '-'
    },
    publisher () {
      return this.metadata ? this.metadata.publisher : '-'
    },
    title () {
      let title = this.metadata ? this.metadata.title : ''
      this.setTitleText(title)
      return title
    },
    author () {
      return this.metadata ? this.metadata.creator : ''
    },
    inBookShelf () {
      if (this.bookItem && this.bookShelf) {
        const flatShelf = (function flatten (arr) {
          return [].concat(...arr.map(v => v.itemList ? [v, ...flatten(v.itemList)] : v))
        })(this.bookShelf).filter(item => item.type === 1)
        const book = flatShelf.filter(item => item.fileName === this.bookItem.fileName)
        return book && book.length > 0
      } else {
        return false
      }
    }
  },
  data () {
    return {
      bookShelf: null,
      bookItem: null,
      book: null,
      // metadata: null,
      trialRead: null,
      // cover: null,
      // navigation: null,
      displayed: true,
      audio: null,
      randomLocation: null,
      description: null,
      toastText: '',
      trialText: null,
      categoryText: null,
      opf: null
    }
  },
  methods: {
    addOrRemoveShelf () {
      if (this.inBookShelf) {
        removeFromBookShelf(this.bookItem)
      } else {
        addToShelf(this.bookItem)
      }
      this.bookShelf = getLocalStorage('bookShelf')
    },
    showToast (text) {
      this.toastText = text
      this.$refs.toast.show()
    },
    readBook () {
      let bookItemKey = `${this.bookItem.categoryText}|${this.bookItem.fileName}`
      getLocalForage(bookItemKey, (err, value) => {
        if (!err && value instanceof Blob) {
          this.$router.push({
            path: `/book/${bookItemKey}`
          })
        } else {
          this.showToast(this.$t('shelf.downloadFirst'))
          this.$router.push({
            path: `/book/${bookItemKey}`,
            query: {
              opf: this.opf
            }
          })
        }
      })
    },
    trialListening () {
      this.showToast(this.$t('detail.expect'))
    },
    itemStyle (item) {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
      }
    },
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
    // initBook () {
    //   if (this.bookItem) {
    //     getLocalForage(this.bookItem.fileName, (err, blob) => {
    //       if (err) {
    //         this.downloadBook()
    //       } else {
    //         if (blob) {
    //           this.parseBook(blob)
    //         } else {
    //           this.downloadBook()
    //         }
    //       }
    //     })
    //   }
    // },
    downloadBook () {
      const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}${this.bookItem.rootFile}`
      this.parseBook(opf)
    },
    parseBook (blob) {
      this.book = new Epub(blob)
      this.book.loaded.cover.then(cover => {
        if (cover) {
          this.setCover(cover)
        }
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        this.setNavigation(nav)
        if (nav.toc && nav.toc.length > 1) {
          this.display(this.navigation.toc[1].href)
          // todo: 通过section的内容获取描述，考虑换成metadata中的description
            .then(section => {
              if (this.$refs.scroll) {
                this.$refs.scroll.refresh()
              }
              this.displayed = true
              // const reg = new RegExp('<.+?>', 'g')
              // const text = section.output.replace(reg, '').replace(/\s\s/g, '')
              // this.description = text
              // this.setDetailDescription(text.substring(0, 200) + '...')
            })
        }
      })
    },
    // findBookFromList (fileName) {
    //   flatList().then(response => {
    //     if (response.status === 200) {
    //       const bookList = response.data.data.filter(item => item.fileName === fileName)
    //       if (bookList && bookList.length > 0) {
    //         this.bookItem = bookList[0]
    //         console.log(this.bookItem)
    //         this.initBook()
    //       }
    //     }
    //   })
    // },
    init () {
      const fileName = this.$route.query.fileName
      this.categoryText = this.$route.query.category
      this.setCategoryText(this.categoryText)
      if (fileName) {
        detail({
          fileName: fileName
        }).then(response => {
          if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
            const data = response.data.data
            this.bookItem = data
            let thisCover = `${process.env.VUE_APP_IMGS_URL}/${this.categoryText}/${this.bookItem.cover}`
            this.setCover(thisCover)
            let rootFile = data.rootFile
            if (rootFile.startsWith('/')) {
              rootFile = rootFile.substring(1, rootFile.length)
            }
            this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.categoryText}/${fileName}/${rootFile}`
            this.parseBook(this.opf)
            this.setDetailData(data)
          } else {
            this.showToast(response.data.msg)
          }
        })
      }
      this.bookShelf = getLocalStorage('bookShelf')
    },
    back () {
      this.$router.go(-1)
    },
    display (location) {
      if (this.$refs.preview) {
        if (!this.rendition) {
          this.rendition = this.book.renderTo('preview', {
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            height: window.innerHeight,
            method: 'default'
          })
        }
        if (!location) {
          return this.rendition.display()
        } else {
          return this.rendition.display(location)
        }
      }
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
    this.init()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-detail {
    width: 100%;
    background: white;
    .content-wrapper {
      width: 100%;
      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;
        .book-detail-content-title {
          font-size: px2rem(20);
          font-weight: bold;
          padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
          box-sizing: border-box;
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
          .book-detail-content-row {
            display: flex;
            box-sizing: border-box;
            margin-bottom: px2rem(10);
            .book-detail-content-label {
              flex: 0 0 px2rem(70);
              font-size: px2rem(14);
              color: #666;
            }
            .book-detail-content-text {
              flex: 1;
              font-size: px2rem(14);
              color: #333;
            }
          }
          #preview {
          }
          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #666;
              border-bottom: px2rem(1) solid #eee;
              &:last-child {
                border-bottom: none;
              }
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
      .audio-wrapper {
        width: 100%;
        padding: px2rem(15);
        box-sizing: border-box;
        #audio {
          width: 100%;
        }
      }
    }
    .bottom-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 120;
      display: flex;
      width: 100%;
      height: px2rem(52);
      box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);
      .bottom-btn {
        flex: 1;
        color: $color-blue;
        font-weight: bold;
        font-size: px2rem(14);
        @include center;
        &:active {
          color: $color-blue-transparent;
        }
        .icon-check {
          margin-right: px2rem(5);
        }
      }
      &.hide-shadow {
        box-shadow: none;
      }
    }
  }
</style>
