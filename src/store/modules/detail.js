const detail = {
  state: {
    detailData: null,
    detailMetadata: null,
    detailNavigation: null,
    detailDescription: null,
    categoryText: '',
    titleText: ''
  },
  mutations: {
    'SET_DETAIL_DATA': (state, detailData) => {
      state.detailData = detailData
    },
    'SET_DETAIL_METADATA': (state, detailMetadata) => {
      state.detailMetadata = detailMetadata
    },
    'SET_DETAIL_NAVIGATION': (state, detailNavigation) => {
      state.detailNavigation = detailNavigation
    },
    'SET_DETAIL_DESCRIPTION': (state, detailDescription) => {
      state.detailDescription = detailDescription
    },
    'SET_CATEGORY_TEXT': (state, categoryText) => {
      state.categoryText = categoryText
    },
    'SET_TITLE_TEXT': (state, titleText) => {
      state.titleText = titleText
    }
  }
}

export default detail
