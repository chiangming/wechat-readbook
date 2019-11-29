import { realPx } from './utils'
import { getReadTime } from './localStorage'
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
  if (!getReadTime(fileName)) {
    return 0
  } else {
    return Math.ceil(getReadTime(fileName) / 60)
  }
}
