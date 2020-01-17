const mall = {
  state: {
    searchList: ['吶喊', '彷徨'],
    hotSearch: [{
      type: 2,
      text: '编辑推荐：懺情者的告白',
      kind: 'book',
      fileName: '17Z4',
      category: 'compound'
    },
    {
      type: 1,
      text: '分手信',
      kind: 'book',
      fileName: '1767',
      category: 'romance'
    },
    {
      type: 1,
      text: '钱钟书',
      kind: 'author',
      keyword: '钱钟书'
    },
    {
      type: 1,
      text: '哈佛家訓',
      kind: 'book',
      fileName: '09B6',
      category: 'humanities'
    },
    {
      type: 1,
      text: '武林客棧．日曜卷',
      kind: 'book',
      fileName: '14P3',
      category: 'martial'
    },
    {
      type: 1,
      text: '王立群',
      kind: 'author',
      keyword: '王立群'
    },
    {
      type: 1,
      text: '全网首发：让你爆笑的传统节日',
      kind: 'news'
    }
    ]
  },
  mutations: {
    'SET_SEARCH_LIST': (state, searchList) => {
      state.searchList = searchList
    },
    'SET_HOT_SEARCH': (state, hotSearch) => {
      state.hotSearch = hotSearch
    }
  }
}

export default mall
