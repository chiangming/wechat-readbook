<template>
  <div class="book-shelf">
    <shelf-search :ifShowSearchPage.sync="ifShowSearchPage"
                  :ifShowHotSearch.sync="ifShowHotSearch"
                  :isDataEmpty="isDataEmpty"
                   ref="searchBar"
                   @back="onBack"
                   v-show="!ifShowTitle">
                    <template v-slot:button="slotProps">
                      <div class="btn-edit-wrapper" @click="onEdit" v-if="slotProps.ifShow">
                        <span class="btn-edit-text">{{$t('shelf.edit')}}</span>
                      </div>
                    </template>
                   </shelf-search>
    <shelf-title class="shelf-title"
                 :title="$t('shelf.title')"
                 :isEditMode.sync="isEditMode"
                 :data="bookList"
                 :ifShowBack="ifShowBack"
                 :ifShowClear="ifShowClear"
                 @onEditClick="onEditClick"
                 @onFullSelect="onFullSelect"
                 ref="shelfTitle"
                 v-show="ifShowTitle"></shelf-title>
    <shelf-classes @onTabClick="onSearchTabClick"
                        ref="shelfSearch"
                        v-if="!isDataEmpty"></shelf-classes>
    <scroll-view class="book-shelf-scroll-wrapper"
                 :top="scrollTop"
                 :bottom="scrollBottom"
                 :initPosition="initPosition"
                 @onScroll="onScroll"
                 ref="scroll"
                 v-if="!isDataEmpty">
      <book-shelf class="book-shelf-list"
                  :data="bookList"
                  :showType="showType"
                  :isEditMode="isEditMode"
                  @onBookClick="onBookClick"
                  ref="bookShelf"
                  v-if="!isDataEmpty"></book-shelf>
    </scroll-view>
    <book-shelf-empty
      class="book-shelf-empty"
      v-if="isDataEmpty"></book-shelf-empty>
    <book-shelf-footer class="book-shelf-footer"
                       :data="bookList"
                       :bookList="bookList"
                       :isInGroup="false"
                       @setPrivate="setPrivate"
                       @setDownload="setDownload"
                       @removeBook="removeBook"
                       @groupEdit="groupEdit"
                       v-show="isEditMode"></book-shelf-footer>
    <common-footer :selectIndex="2" v-show="!isEditMode"></common-footer>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
import ShelfTitle from '@/components/mall/shelf/shelfTitle'
import ShelfClasses from '@/components/mall/shelf/shelfClasses'
import ShelfSearch from '@/components/common/search'
import BookShelf from '@/components/mall/shelf/shelf'
import ScrollView from '@/components/common/scroll'
import BookShelfFooter from '@/components/mall/shelf/bookShelfFooter'
import BookShelfEmpty from '@/components/mall/shelf/bookShelfEmpty'
import Toast from '@/components/common/toast'
import CommonFooter from '@/components/common/footer'
import { shelf, download } from '@/api/mall'
import { getLocalStorage, setLocalStorage, clearLocalStorage } from '@/utils/localStorage'
import { getLocalForage, clearLocalForage } from '@/utils/localForage'
import { removeBookCache } from '@/utils/book'
import Epub from 'epubjs'
import { realPx } from '@/utils/utils'

global.ePub = Epub

const BOOK_SHELF_KEY = 'bookShelf'
export default {
  components: {
    ShelfTitle,
    ShelfClasses,
    ShelfSearch,
    BookShelf,
    ScrollView,
    BookShelfFooter,
    BookShelfEmpty,
    Toast,
    CommonFooter
  },
  computed: {
    isDataEmpty () {
      return !this.bookList || this.bookList.filter(item => item.type !== 3).length === 0
    }
  },
  data () {
    return {
      bookList: [],
      ifShowTitle: false,
      isEditMode: false,
      isFullSelect: false,
      ifShowBack: false,
      ifShowClear: true,
      scrollTop: 94,
      scrollBottom: 42,
      toastText: '',
      showType: 0,
      ifShowSearchPage: false,
      ifShowHotSearch: false,
      initPosition: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    onEdit () {
      this.onEditClick(true)
      this.showTitle()
    },
    onBack () {
    },
    onSearchTabClick (id) {
      this.showType = id
    },
    groupEdit (operation, group) {
      switch (operation) {
        case 1:
          this.moveToGroup(group)
          break
        case 2:
          this.newGroup(group)
          this.moveToGroup(group)
          break
        case 3:
          this.moveOutGroup()
          break
      }
    },
    getSelectedBooks () {
      const selectedBooks = this.bookList.filter(item => {
        return item.selected
      })
      this.bookList.filter(item => {
        if (item.type === 2 && item.itemList) {
          item.itemList.filter(subItem => {
            if (subItem.selected) {
              selectedBooks.push(subItem)
            }
          })
        }
      })
      return selectedBooks
    },
    clearSelectedBooks () {
      this.bookList = this.bookList.filter(item => {
        return !item.selected
      })
      this.bookList.forEach(item => {
        if (item.type === 2 && item.itemList) {
          item.itemList = item.itemList.filter(subItem => {
            return !subItem.selected
          })
        }
      })
    },
    appendBookToList (selectedBooks) {
      let id = this.bookList[this.bookList.length - 1].id + 1
      selectedBooks.forEach(item => {
        item.id = id++
        this.bookList.push(item)
      })
    },
    moveOutGroup () {
      this.clearAddFromBookList()
      const selectedBooks = this.getSelectedBooks()
      this.clearSelectedBooks()
      this.appendBookToList(selectedBooks)
      this.appendAddToBookList()
      this.onEditClick(false)
      this.saveBookShelfToLocalStorage()
      this.showToast(this.$t('shelf.moveBookOutSuccess'))
    },
    newGroup (group) {
      this.clearAddFromBookList()
      this.bookList.push(group)
      this.appendAddToBookList()
    },
    moveToGroup (group) {
      const selectedBooks = this.getSelectedBooks()
      this.clearSelectedBooks()
      if (group && group.itemList) {
        group.itemList = [...group.itemList, ...selectedBooks]
        group.itemList.forEach((item, index) => {
          item.id = index + 1
        })
      }
      this.onEditClick(false)
      this.saveBookShelfToLocalStorage()
      this.showToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
    },
    appendAddToBookList () {
      this.bookList.push({
        cover: '',
        title: '',
        type: 3,
        // id: this.bookList[this.bookList.length - 1].id + 1
        id: Number.MAX_SAFE_INTEGER
      })
    },
    clearAddFromBookList () {
      this.bookList = this.bookList.filter(item => {
        return item.type !== 3
      })
    },
    removeBook () {
      this.bookList = this.bookList.filter(item => {
        if (item.itemList) {
          item.itemList = item.itemList.filter(subItem => {
            return !subItem.selected
          })
        }
        return !item.selected
      })
      // this.$refs.bookShelf.showRemoveAnimation()
      this.onEditClick(false)
      this.saveBookShelfToLocalStorage()
    },
    clearCache () {
      clearLocalStorage()
      clearLocalForage(() => {
        // console.log('清除localForage成功...')
        this.getBookShelf()
      })
      this.showToast(this.$t('shelf.clearCacheSuccess'))
    },
    onBookClick (item, index) {
      this.$router.push({
        path: '/mall/detail',
        query: {
          fileName: item.fileName,
          category: item.categoryText
        }
      })
    },
    showToast (text) {
      this.toastText = text
      this.$refs.toast.show()
    },
    hideToast () {
      this.$refs.toast.hide()
    },
    showContinueToast (text) {
      this.toastText = text
      this.$refs.toast.continueShow()
    },
    removeDownloadBook (item) {
      return removeBookCache(item.fileName)
    },
    downloadBook (item) {
      return new Promise((resolve, reject) => {
        getLocalForage(item.fileName, (err, value) => {
          if (!err && value instanceof Blob) {
            // console.log(`[${item.fileName}]读取成功...`, value, new Epub(value))
            resolve()
          } else {
            download(item, item => {
              // console.log('[' + item.fileName + ']下载成功...')
              resolve()
            }, reject, reject, progressEvent => {
              const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
              this.toastText = this.$t('shelf.progressDownload').replace('$1', `${item.fileName}.epub(${progress})`)
            })
          }
        })
      })
    },
    async setDownload (needDownload) {
      this.showContinueToast(this.$t('shelf.startDownload'))
      for (let i = 0; i < this.bookList.length; i++) {
        const item = this.bookList[i]
        if (needDownload && item.selected) {
          await this.downloadBook(item).then(() => {
            item.cache = needDownload
          })
        } else if (!needDownload && item.selected) {
          await this.removeDownloadBook(item).then(() => {
            item.cache = needDownload
          })
        }
        if (item.itemList) {
          for (let i = 0; i < item.itemList.length; i++) {
            await this.downloadItem(item.itemList[i], needDownload)
          }
        }
      }
      this.hideToast()
      if (needDownload) {
        this.showToast(this.$t('shelf.setDownloadSuccess'))
      } else {
        this.showToast(this.$t('shelf.removeDownloadSuccess'))
      }
      this.onEditClick(false)
      this.saveBookShelfToLocalStorage()
      // console.log('数据保存成功...')
    },
    async downloadItem (subItem, needDownload) {
      if (needDownload && subItem.selected) {
        await this.downloadBook(subItem).then(() => {
          subItem.cache = needDownload
        })
      } else if (!needDownload && subItem.selected) {
        await this.removeDownloadBook(subItem).then(() => {
          subItem.cache = needDownload
        })
      }
    },
    setPrivate (v) {
      this.bookList.forEach(item => {
        if (item.selected) {
          item.private = v
        }
      })
      this.onEditClick(false)
      this.saveBookShelfToLocalStorage()
      if (v) {
        this.showToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.showToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    onEditClick (v) {
      this.isEditMode = v
      if (!this.isEditMode) {
        this.hideTitle()
        this.bookList.forEach(item => {
          if (item.bookId) {
            item.selected = false
          } else if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        })
      }
      if (this.isEditMode) {
        this.showTitle()
        this.scrollTop = 42
        this.scrollBottom = 48
        this.$nextTick(() => {
          if (this.$refs.scroll) {
            this.$refs.scroll.refresh()
          }
        })
      } else {
        this.scrollTop = 94
        this.scrollBottom = 48
        this.$nextTick(() => {
          if (this.$refs.scroll) {
            this.$refs.scroll.refresh()
          }
        })
      }
    },
    onFullSelect (v) {
      this.isFullSelect = v
      if (this.isFullSelect) {
        this.$refs.bookShelf.fullSelect()
      } else {
        this.$refs.bookShelf.cancelFullSelect()
      }
    },
    onSearchClick () {
      this.onEditClick(false)
      this.showType = 1
      this.hideTitle()
    },
    onSearchCancel () {
      this.showTitle()
      this.showType = 0
      this.$refs.scroll.scrollTo(0, 0)
    },
    showTitle () {
      this.ifShowTitle = true
    },
    hideTitle () {
      this.ifShowTitle = false
    },
    onScroll (offsetY) {
      if (offsetY > realPx(54)) {
        this.$refs.shelfTitle.showShadow()
        if (!this.ifShowTitle) {
          this.$refs.shelfSearch.showShadow()
        }
      } else {
        this.$refs.shelfTitle.hideShadow()
        if (this.$refs.shelfSearch) {
          this.$refs.shelfSearch.hideShadow()
        }
      }
    },
    getBookShelf () {
      this.bookList = this.getBookShelfFromLocalStorage()
      if (!this.bookList) {
        shelf().then(response => {
          this.bookList = response.data.bookList
          if (!this.bookList) {
            this.bookList = []
          }
          this.appendAddToBookList()
          this.saveBookShelfToLocalStorage()
          this.initBookShelf()
        })
      }
      this.initBookShelf()
    },
    initBookShelf () {
      if (this.bookList) {
        this.bookList.forEach(item => {
          item.selected = false
        })
      }
    },
    saveBookShelfToLocalStorage () {
      setLocalStorage(BOOK_SHELF_KEY, this.bookList)
    },
    getBookShelfFromLocalStorage () {
      return getLocalStorage(BOOK_SHELF_KEY)
    }
  },
  mounted () {
    this.getBookShelf()
    if (this.isDataEmpty) {
      this.scrollTop = 0
      this.scrollBottom = 0
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    font-size: 0;
    .shelf-title {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 110;
    }
    .book-shelf-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
    }
    .book-shelf-empty {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 100;
    }
    .book-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      background: white;
    }
    .book-shelf-scroll-wrapper2 {
      position: absolute;
      top: px2rem(93.5);
      left: 0;
      z-index: 101;
    }
  }
</style>
