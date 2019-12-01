const getters = {
  fileName: state => state.book.fileName,
  menuVisible: state => state.book.menuVisible,
  settingVisible: state => state.book.settingVisible,
  defaultFontSize: state => state.book.defaultFontSize,
  defaultFontFamily: state => state.book.defaultFontFamily,
  defaultFontName: state => state.book.defaultFontName,
  fontFamilyVisible: state => state.book.fontFamilyVisible,
  defaultTheme: state => state.book.defaultTheme,
  bookAvailable: state => state.book.bookAvailable,
  progress: state => state.book.progress,
  section: state => state.book.section,
  isPaginating: state => state.book.isPaginating,
  currentBook: state => state.book.currentBook,
  navigation: state => state.book.navigation,
  cover: state => state.book.cover,
  metadata: state => state.book.metadata,
  paginate: state => state.book.paginate,
  pagelist: state => state.book.pagelist,
  offsetX: state => state.book.offsetX,
  offsetY: state => state.book.offsetY,
  isBookmark: state => state.book.isBookmark,
  locationLength: state => state.book.locationLength
}

export default getters
