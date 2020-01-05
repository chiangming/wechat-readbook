const actions = {
  // book模块
  setMenuVisible: ({ commit }, visible) => {
    return commit('SET_MENU_VISIBLE', visible)
  },
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILENAME', fileName)
  },
  setFontFamilyVisible: ({ commit }, visible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', visible)
  },
  setDefaultFontFamily: ({ commit }, font) => {
    return commit('SET_DEFAULT_FONT_FAMILY', font)
  },
  setDefaultFontSize: ({ commit }, fontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', fontSize)
  },
  setSettingVisible: ({ commit }, visible) => {
    return commit('SET_SETTING_VISIBLE', visible)
  },
  setDefaultTheme: ({ commit }, theme) => {
    return commit('SET_DEFAULT_THEME', theme)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setSection: ({ commit }, section) => {
    return commit('SET_SECTION', section)
  },
  setLocationLength: ({ commit }, length) => {
    return commit('SET_LOCATION_LENGTH', length)
  },
  setIsPaginating: ({ commit }, isPaginating) => {
    return commit('SET_IS_PAGINATING', isPaginating)
  },
  setCurrentBook: ({ commit }, book) => {
    return commit('SET_CURRENT_BOOK', book)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit('SET_NAVIGATION', navigation)
  },
  setCover: ({ commit }, cover) => {
    return commit('SET_COVER', cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  setPagelist: ({ commit }, pagelist) => {
    return commit('SET_PAGELIST', pagelist)
  },
  setIsBookmark ({ commit }, isBookmark) {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  setOffsetX ({ commit }, offsetX) {
    return commit('SET_OFFSETX', offsetX)
  },
  setOffsetY ({ commit }, offsetY) {
    return commit('SET_OFFSETY', offsetY)
  },
  // detail模块
  setDetailData ({ commit }, detailData) {
    return commit('SET_DETAIL_DATA', detailData)
  },
  setDetailMetadata ({ commit }, metadata) {
    return commit('SET_DETAIL_METADATA', metadata)
  },
  setDetailNavigation ({ commit }, navigation) {
    return commit('SET_DETAIL_NAVIGATION', navigation)
  },
  setDetailDescription ({ commit }, description) {
    return commit('SET_DETAIL_DESCRIPTION', description)
  },
  setCategoryText ({ commit }, categoryText) {
    return commit('SET_CATEGORY_TEXT', categoryText)
  },
  setTitleText ({ commit }, title) {
    return commit('SET_TITLE_TEXT', title)
  }
}

export default actions
