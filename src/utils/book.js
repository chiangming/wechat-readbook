import { realPx } from './utils'
import { getReadTime, getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage'
import { removeLocalForage } from './localForage'
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: '默认字体', fontName: '默认字体' },
  { font: 'STKaiti', fontName: '华文楷体' },
  { font: 'STLiti', fontName: '华文隶体' },
  { font: 'STXingkai', fontName: '华文行楷' },
  { font: 'STZhongsong', fontName: '华文中宋' }

]

export function themeList (vue) {
  return [{
    alias: vue.$t('book.themeDefault'),
    name: 'Default',
    style: {
      body: {
        'color': '#4c5059',
        'background': '#cecece',
        'padding-top': `${realPx(48)}px!important`,
        'padding-bottom': `${realPx(48)}px!important`
      },
      img: {
        'width': '100%'
      },
      '.epubjs-hl': {
        'fill': 'red',
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply'
      }
    }
  },
  {
    alias: vue.$t('book.themeGold'),
    name: 'Gold',
    style: {
      body: {
        'color': '#5c5b56',
        'background': '#c6c2b6',
        'padding-top': `${realPx(48)}px!important`,
        'padding-bottom': `${realPx(48)}px!important`
      },
      img: {
        'width': '100%'
      },
      '.epubjs-hl': {
        'fill': 'red',
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply'
      }
    }
  },
  {
    alias: vue.$t('book.themeEye'),
    name: 'Eye',
    style: {
      body: {
        'color': '#404c42',
        'background': '#a9c1a9',
        'padding-top': `${realPx(48)}px!important`,
        'padding-bottom': `${realPx(48)}px!important`
      },
      img: {
        'width': '100%'
      },
      '.epubjs-hl': {
        'fill': 'red',
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply'
      }
    }
  },
  {
    alias: vue.$t('book.themeNight'),
    name: 'Night',
    style: {
      body: {
        'color': '#cecece',
        'background': '#000000',
        'padding-top': `${realPx(48)}px!important`,
        'padding-bottom': `${realPx(48)}px!important`
      },
      img: {
        'width': '100%'
      },
      '.epubjs-hl': {
        'fill': 'red',
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply'
      }
    }
  }
  ]
}

export function getReadTimeByMinute (fileName) {
  return getReadTime(fileName) ? Math.ceil(getReadTime(fileName)) : 0
}

// 获取书的细节
export function showBookDetail (vue, book) {
  vue.$router.push({
    path: '/mall/detail',
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}

// 获取分类路径
export function getCategoryName (id) {
  switch (id) {
    case 1:
      return 'contemporary'
    case 2:
      return 'humanities'
    case 3:
      return 'history'
    case 4:
      return 'martial'
    case 5:
      return 'suspense'
    case 6:
      return 'romance'
    case 7:
      return 'fantasy'
    case 8:
      return 'compound'
    case 9:
      return 'free'
    case 10:
      return 'recommend'
  }
}

// 获取分类
export function categoryText (category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.contemporary')
    case 2:
      return vue.$t('category.humanities')
    case 3:
      return vue.$t('category.history')
    case 4:
      return vue.$t('category.martial')
    case 5:
      return vue.$t('category.suspense')
    case 6:
      return vue.$t('category.romance')
    case 7:
      return vue.$t('category.fantasy')
    case 8:
      return vue.$t('category.compound')
    case 9:
      return vue.$t('category.free')
    case 10:
      return vue.$t('category.recommend')
    default:
      return ''
  }
}

export function arrayTrans (num, arr) { // 一维数组转换为二维数组
  const iconsArr = [] // 声明数组
  arr.forEach((item, index) => {
    item.index = index + 1
    const page = Math.floor(index / num) // 计算该元素为第几个数组内
    if (!iconsArr[page]) { // 判断是否存在
      iconsArr[page] = []
    }
    iconsArr[page].push(item)
  })
  return iconsArr
}

// todo: 改写list
export const categoryList = {
  contemporary: 1,
  humanities: 2,
  history: 3,
  martial: 4,
  suspense: 5,
  romance: 6,
  fantasy: 7,
  compound: 8,
  free: 9,
  recommend: 10,
  'ranklist-all': 11,
  'ranklist-rising': 12
}

const BOOK_SHELF_KEY = 'bookShelf'

export function addToShelf (book) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY) || []
  bookList = clearAddFromBookList(bookList)
  book.type = 1
  bookList.push(book)
  bookList.forEach((item, index) => {
    item.id = index + 1
  })
  appendAddToBookList(bookList)
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

export function appendAddToBookList (bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}

export function clearAddFromBookList (bookList) {
  return bookList.filter(item => {
    return item.type !== 3
  })
}

export function removeFromBookShelf (bookItem) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  bookList = bookList.filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subItem => subItem.fileName !== bookItem.fileName)
    }
    return item.fileName !== bookItem.fileName
  })
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

export function flatBookList (bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => { return item.type !== 2 })
    return orgBookList
  } else {
    return []
  }
}

export function findBook (fileName) {
  const bookList = getLocalStorage(BOOK_SHELF_KEY)
  return flatBookList(bookList).find(item => item.fileName === fileName)
}

export function removeBookCache (fileName) {
  return new Promise((resolve, reject) => {
    removeLocalStorage(fileName)
    removeLocalStorage(`${fileName}-info`)
    removeLocalForage(fileName, () => {
      // console.log(`[${fileName}]删除成功...`)
      resolve()
    }, reject)
  })
}

export function switchLocale (vue) {
  if (vue.$i18n.locale === 'en') {
    vue.$i18n.locale = 'cn'
  } else {
    vue.$i18n.locale = 'en'
  }
  setLocalStorage('locale', vue.$i18n.locale)
}

export function reset (vue) {
  vue.$store.dispatch('setMenuVisible', false)
  vue.$store.dispatch('setSettingVisible', 0)
  vue.$store.dispatch('setFontFamilyVisible', false)
  vue.$store.dispatch('setSpeakingIconBottom', realPx(58))
}

export function setHistorySearchList (list) {
  // console.log('set')
  setLocalStorage('history', list)
}

export function getHistorySearchList () {
  // console.log('get')
  return getLocalStorage('history')
}
