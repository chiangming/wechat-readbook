const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1, // -1 表示不显示，0表示显示
    defaultFontSize: 16,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    bookAvailable: false,
    progress: 0,
    section: 0,
    isPaginating: true,
    currentBook: null,
    navigation: null,
    cover: null,
    metadata: null,
    paginate: '',
    pagelist: null,
    offsetY: 0,
    isBookmark: null
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENU_VISIBLE': (state, visible) => {
      state.menuVisible = visible
    }
  },
  actions: {
    setFileName: ({ commit, state }, fileName) => {
      return commit('SET_FILENAME', fileName)
    },
    setMenuVisible: ({ commit }, visible) => {
      return commit('SET_MENU_VISIBLE', visible)
    }
  }
}

export default book
