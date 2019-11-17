import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY } from './book'

export const ebookMixin = {
  data () {
    return {
      fontSizeList: FONT_SIZE_LIST,
      fontFamily: FONT_FAMILY
    }
  },
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ])

  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    showFontFamilySetting () {
      this.setFontFamilyVisible(true)
    },
    showSetting (key) {
      this.setSettingVisible(key)
    },
    hideMenuVisible () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    toggleMenuVisible () {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideFontFamilySetting () {
      this.setFontFamilyVisible(false)
    },
    registerTheme () {
      this.themeList.forEach(theme => {
        this.currentBook.rendition.themes.register(theme.name, theme.style)
      })
    },
    switchTheme () {
      const rules = this.themeList.filter(theme => theme.name === this.defaultTheme)[0]
      if (this.defaultFontFamily && this.defaultFontFamily !== '默认字体') {
        rules.style.body['font-family'] = `${this.defaultFontFamily}!important`
      } else {
        rules.style.body['font-family'] = `Times New Roman!important`
      }
      this.registerTheme()
      this.currentBook.rendition.themes.select(this.defaultTheme)
      this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
      this.setGlobalTheme(this.defaultTheme)
    },
    setFontSize (fontSize) {
      this.setDefaultFontSize(fontSize).then(() => {
        this.switchTheme()
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },
    setTheme (theme) {
      this.setDefaultTheme(theme).then(() => {
        this.switchTheme()
        Storage.saveTheme(this.fileName, theme)
      })
    },
    setFontFamily (font) {
      this.setDefaultFontFamily(font).then(() => {
        console.log('设置成功', font)
        // this.switchTheme()
        // Storage.saveFontFamily(this.fileName, font)
      })
      this.currentBook.rendition.themes.font(font)
      console.log(this.currentBook.rendition.themes.font(font))
    },
    displaySection (cb) {
      const section = this.currentBook.section(this.section)
      if (section && section.href) {
        this.currentBook.rendition.display(section.href).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    displayProgress () {
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      this.currentBook.rendition.display(cfi).then(() => {
        this.refreshLocation()
      })
    },
    display (target, highlight = false) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          if (highlight) {
            if (target.startsWith('epubcfi')) {
              this.currentBook.getRange(target).then(range => {
                this.currentBook.rendition.annotations.highlight(target, {}, (e) => {})
              })
            }
          }
          this.refreshLocation()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
        })
      }
      this.hideMenuVisible()
    },
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation.start && currentLocation.start.index) {
        this.setSection(currentLocation.start.index)
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        this.setProgress(Math.floor(progress * 100))
        if (this.pagelist) {
          if (currentLocation.start.location <= 0) {
            this.setPaginate('')
          } else {
            this.setPaginate(currentLocation.start.location + ' / ' + this.pagelist.length)
          }
        } else {
          this.setPaginate('')
        }
        const cfistart = currentLocation.start.cfi
        const bookmark = Storage.getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === cfistart)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        Storage.saveLocation(this.fileName, cfistart)
      }
    }
  }
}
