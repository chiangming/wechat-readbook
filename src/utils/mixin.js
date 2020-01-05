import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute, showBookDetail } from './book'
import * as Utils from './utils'
import * as Storage from './localStorage'

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
      'defaultFontName',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'locationLength',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList () {
      return themeList(this)
    },
    getSectionName () {
      // if (this.section !== null || this.section !== undefined) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
      //     // return this.currentBook.navigation.get(sectionInfo.href).label
      //     return this.navigation[this.section].label
      //   }
      // }
      // return '章节名'
      return this.section ? this.navigation[this.section].label : '章节名'
    }

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
      'setLocationLength',
      'setIsPaginating',
      'setCurrentBook',
      'setCurrentLocation',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetX',
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
    setGlobalTheme (theme) {
      Utils.removeAllCss()
      switch (theme) {
        case 'Default':
          Utils.addCss(`${process.env.VUE_APP_THEME_URL}/theme_default.css`)
          break
        case 'Eye':
          Utils.addCss(`${process.env.VUE_APP_THEME_URL}/theme_eye.css`)
          break
        case 'Gold':
          Utils.addCss(`${process.env.VUE_APP_THEME_URL}/theme_gold.css`)
          break
        case 'Night':
          Utils.addCss(`${process.env.VUE_APP_THEME_URL}/theme_night.css`)
          break
        default:
          this.setDefaultTheme('Default')
          Utils.addCss(`${process.env.VUE_APP_THEME_URL}/theme_default.css`)
          break
      }
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
        // this.switchTheme()
        Storage.saveFontFamily(this.fileName, font)
      })
      if (font === '默认字体') {
        this.currentBook.rendition.themes.font('Times New Roman')
      } else {
        this.currentBook.rendition.themes.font(font)
        // console.log('设置成功', font)
      }
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
      // console.log(currentLocation)
      if (currentLocation.start && currentLocation.start.index && currentLocation.start.index >= 0) {
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
    },
    getReadTime () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}

export const detailMixin = {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'detailData',
      'detailMetadata',
      'detailNavigation',
      'detailDescription',
      'detailCategoryText',
      'detailTitleText'
    ])
  },
  methods: {
    ...mapActions([
      'setDetailData',
      'setDetailMetadata',
      'setDetailNavigation',
      'setDetailDescription',
      'setCategoryText',
      'setTitleText'
    ]),
    showBookDetail (item) {
      showBookDetail(this, item)
    },
    coverUrl (item) {
      if (item.categoryText && item.cover) {
        return `${process.env.VUE_APP_IMGS_URL}/${item.categoryText}/${item.cover}`
      } else {
        // todo: 添加默认图片
      }
    }
  }
}
