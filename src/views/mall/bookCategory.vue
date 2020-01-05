<template>
  <div class="book-category">
    <shelf-title class="shelf-title"
                 :title="category.title"
                 :isEditMode.sync="isEditMode"
                 :ifShowBack="ifShowBack"
                 :ifShowClear="ifShowClear"
                 :ifGroupEmpty="isEmpty"
                 :data="bookList"
                 :category="category"
                 @onEditClick="onEditClick"
                 @deleteGroup="deleteGroup"
                 @editGroupName="editGroupName"
                 ref="shelfTitle"></shelf-title>
    <scroll-view class="book-shelf-scroll-wrapper"
                 :top="42"
                 :bottom="scrollBottom"
                 @onScroll="onScroll"
                 ref="scroll"
                 v-if="!isEmpty">
      <book-shelf class="book-shelf-list"
                  :data="category.itemList"
                  :isEditMode="isEditMode"
                  @onBookClick="onBookClick"
                  ref="bookShelf"></book-shelf>
    </scroll-view>
    <book-shelf-footer class="book-shelf-footer"
                       :data="category.itemList"
                       :bookList="bookList"
                       :isInGroup="true"
                       :category="category"
                       @setPrivate="setPrivate"
                       @setDownload="setDownload"
                       @removeBook="removeBook"
                       @groupEdit="groupEdit"
                       v-if="isEditMode && !isEmpty"></book-shelf-footer>
    <toast :text="toastText" ref="toast"></toast>
    <div class="shelf-empty-view" v-if="isEmpty">
      <span class="shelf-empty-text">{{$t('shelf.groupNone')}}</span>
    </div>
  </div>
</template>

<script>
  import ShelfTitle from '@/components/shelf/shelfTitle'
  import BookShelf from '@/components/shelf/shelf'
  import ScrollView from '@/components/Scroll'
  import BookShelfFooter from '@/components/shelf/bookShelfFooter'
  import Toast from '@/components/shelf/toast'
  import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'
  import { getLocalForage, removeLocalForage } from '@/utils/localForage'
  import { download } from '@/api/book'
  import Epub from 'epubjs'

  global.ePub = Epub

  const BOOK_SHELF_KEY = 'bookShelf'

  export default {
    components: {
      ShelfTitle,
      ScrollView,
      BookShelf,
      BookShelfFooter,
      Toast
    },
    computed: {
      isEmpty() {
        if (this.category && this.category.itemList && this.category.itemList.length > 0) {
          return false
        } else {
          return true
        }
      }
    },
    data() {
      return {
        index: null,
        bookList: [],
        category: {},
        isEditMode: false,
        ifShowBack: true,
        ifShowClear: false,
        scrollBottom: 0,
        toastText: ''
      }
    },
    methods: {
      editGroupName(category, groupName) {
        category.title = groupName
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
      },
      deleteGroup(category) {
        const itemList = this.getBooksFromCategory(category)
        this.removeCategory(category)
        this.clearAddFromBookList()
        this.appendBookToList(itemList)
        this.appendAddToBookList()
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        this.$router.go(-1)
      },
      removeCategory(category) {
        this.bookList = this.bookList.filter(item => {
          return category.id !== item.id
        })
      },
      getBooksFromCategory(category) {
        return category.itemList
      },
      groupEdit(operation, group) {
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
      getSelectedBooks() {
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
      clearSelectedBooks() {
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
      appendBookToList(selectedBooks) {
        let id = this.bookList[this.bookList.length - 1].id + 1
        selectedBooks.forEach(item => {
          item.id = id++
          this.bookList.push(item)
        })
      },
      moveOutGroup() {
        this.clearAddFromBookList()
        const selectedBooks = this.getSelectedBooks()
        this.clearSelectedBooks()
        this.appendBookToList(selectedBooks)
        this.appendAddToBookList()
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        this.showToast(this.$t('shelf.moveBookOutSuccess'))
      },
      newGroup(group) {
        this.clearAddFromBookList()
        this.bookList.push(group)
        this.appendAddToBookList()
      },
      moveToGroup(group) {
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
      appendAddToBookList() {
        this.bookList.push({
          cover: '',
          title: '',
          type: 3,
          id: this.bookList[this.bookList.length - 1].id + 1
        })
      },
      clearAddFromBookList() {
        this.bookList = this.bookList.filter(item => {
          return item.type !== 3
        })
      },
      removeBook() {
        this.bookList = this.bookList.filter(item => {
          if (item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected
            })
          }
          return !item.selected
        })
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
      },
      onBookClick(item, index) {
        this.$router.push({
          path: '/book-store/detail',
          query: {
            fileName: item.fileName,
            category: item.categoryText
          }
        })
      },
      showToast(text) {
        this.toastText = text
        this.$refs.toast.show()
      },
      removeDownloadBook(item) {
        return new Promise((resolve, reject) => {
          removeLocalForage(item.fileName, () => {
            console.log(`[${item.fileName}]删除成功...`)
            resolve()
          }, reject)
        })
      },
      downloadBook(item) {
        return new Promise((resolve, reject) => {
          getLocalForage(item.fileName, (err, value) => {
            if (!err && value instanceof Blob) {
              console.log(`[${item.fileName}]读取成功...`, value, new Epub(value))
              resolve()
            } else {
              download(item, item => {
                console.log('[' + item.fileName + ']下载成功...')
                resolve()
              }, reject, reject)
            }
          })
        })
      },
      async setDownload(needDownload) {
        if (needDownload) {
          this.showToast(this.$t('shelf.setDownloadSuccess'))
        } else {
          this.showToast(this.$t('shelf.removeDownloadSuccess'))
        }
        for (let i = 0; i < this.bookList.length; i++) {
          const item = this.bookList[i]
          if (needDownload && item.selected) {
            console.log(`item-正在处理第${i + 1}本书`)
            await this.downloadBook(item).then(() => {
              item.cache = needDownload
            })
          } else if (!needDownload && item.selected) {
            console.log(`item-正在处理第${i + 1}本书`)
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
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        console.log('数据保存成功...')
      },
      async downloadItem(subItem, needDownload) {
        console.log(`subItem-正在处理${subItem.fileName}`)
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
      setPrivate(v) {
        this.bookList.forEach(item => {
          if (item.selected) {
            item.private = v
          }
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              if (subItem.selected) {
                subItem.private = v
              }
            })
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
      onEditClick(v) {
        this.isEditMode = v
        if (!this.isEditMode) {
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
          this.scrollBottom = 48
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        } else {
          this.scrollBottom = 0
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        }
      },
      onScroll(offsetY) {
        if (offsetY > 0) {
          this.$refs.shelfTitle.showShadow()
        } else {
          this.$refs.shelfTitle.hideShadow()
        }
      },
      getBookList() {
        this.bookList = this.getBookShelfFromLocalStorage()
      },
      getCategoryList() {
        this.index = this.$route.query.index
        this.category = this.bookList[this.index]
        console.log(this.category)
      },
      saveBookShelfToLocalStorage() {
        setLocalStorage(BOOK_SHELF_KEY, this.bookList)
      },
      getBookShelfFromLocalStorage() {
        return getLocalStorage(BOOK_SHELF_KEY)
      }
    },
    mounted() {
      this.getBookList()
      this.getCategoryList()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-category {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(14);
      color: #333;
    }
  }
</style>
