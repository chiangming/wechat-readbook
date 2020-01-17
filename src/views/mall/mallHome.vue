<template>
  <div class="mall-home">
    <search-bar @showFlapCard="showFlapCard"
                :ifShowSearchPage.sync="ifShowSearchPage"
                :ifShowHotSearch.sync="ifShowHotSearch"
                :bookListOffsetY="bookListOffsetY"
                @back="onBack"
                ref="searchBar"></search-bar>
    <div class="book-list-wrapper" v-show="!ifShowSearchPage || !ifShowHotSearch" ref="bookListWrapper">
      <top-category :rankLists="rankLists" ></top-category>
      <all-category :data="categories"></all-category>
    </div>
    <flap-card v-if="ifFlapCardShow"
               @close="closeFlapCard"
               :data="random"
               ref="flapCard"></flap-card>
  </div>
</template>
<script type="text/javascript">
import FlapCard from '@/components/mall/home/flapCard'
import SearchBar from '@/components/mall/home/searchBar'
import TopCategory from '@/components/mall/home/module/topCategory'
import AllCategory from '@/components/mall/home/module/allCategory'
import { home, rankListAll, rankListRising } from '@/api/mall'
import { realPx } from '@/utils/utils'
import { getLocalStorage, setLocalStorage, getRankList, saveRankList, getHome, saveHome } from '@/utils/localStorage'

export default {
  components: {
    AllCategory,
    TopCategory,
    FlapCard,
    SearchBar
  },
  computed: {
    defaultRandom () {
      return {
        cover: '@/assets/images/loading1.jpeg',
        title: '未找到您感兴趣的书籍',
        author: '请稍后再试',
        category: 0
      }
    }
  },
  data () {
    return {
      isBack: false,
      ifFlapCardShow: false,
      ifShowSearchPage: false,
      ifShowHotSearch: true,
      data: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null,
      random: null,
      randomList: null,
      bookListOffsetY: 0,
      rankListAll: [],
      rankListRising: [],
      rankListNewBook: [],
      rankListNovel: [],
      rankLists: []
    }
  },
  methods: {
    onBack () {
      this.isBack = true
    },
    handleBookListScroll (e) {
      const target = e.target
      if (target) {
        this.bookListOffsetY = target.scrollTop
        // 搜索框是否上移显示
        if (target.scrollTop > 0) {
          if (this.$refs.searchBar) {
            this.$refs.searchBar.showSearchPage()
            this.$refs.searchBar.showShadow()
            this.ifShowHotSearch = false
          }
        } else {
          if (this.$refs.searchBar) {
            this.$refs.searchBar.hideSearchPage()
          }
        }
      }
    },
    showFlapCard () {
      this.ifFlapCardShow = true
      if (this.randomList) {
        const randomNumber = parseInt(Math.random() * this.randomList.length)
        this.random = this.randomList[randomNumber]
      } else {
        this.random = this.defaultRandom
      }
      this.$nextTick(() => {
        this.$refs.flapCard.startAnimation()
      })
    },
    closeFlapCard () {
      this.$refs.flapCard.stopAnimation()
      this.ifFlapCardShow = false
    },
    parseHomeData (data) {
      this.data = data
      this.categoryList = data.categoryList
      this.categories = data.categories
      this.randomList = data.random
      this.rankListNewBook = data.rankListNewBook
      this.rankListNovel = data.rankListNovel
    },
    parseAllData (data) {
      this.rankListAll = data.rankListAll
    },
    parseRisingData (data) {
      this.rankListRising = data.rankListRising
    },
    arrTrans (num, arr) { // 一维数组转换为二维数组
      const iconsArr = []
      arr.forEach((item, index) => {
        const page = Math.floor(index / num)
        if (!iconsArr[page]) {
          iconsArr[page] = []
        }
        iconsArr[page].push(item)
      })
      return iconsArr
    },
    parseRankList () {
      this.rankLists.push({
        title: '总榜',
        cover: `${process.env.VUE_APP_IMGS_URL}/pictures/ranklist.all.chart_title.png`,
        list: this.arrTrans(3, this.rankListAll),
        category: 'ranklist-all'
      })
      this.rankLists.push({
        title: '飙升',
        cover: `${process.env.VUE_APP_IMGS_URL}/pictures/ranklist.rising.chart_title.png`,
        list: this.arrTrans(3, this.rankListRising),
        category: 'ranklist-rising'
      })
      this.rankLists.push({
        title: '新书',
        cover: `${process.env.VUE_APP_IMGS_URL}/pictures/ranklist.newbook.chart_title.png`,
        list: this.arrTrans(3, this.rankListNewBook),
        category: 'free'
      })
      this.rankLists.push({
        title: '小说',
        cover: `${process.env.VUE_APP_IMGS_URL}/pictures/ranklist.novel.chart_title.png`,
        list: this.arrTrans(3, this.rankListNovel),
        category: 'fantasy'
      })
      return this.rankLists
    }
  },
  mounted () {
    let rankList = getRankList()
    let homeData = getHome()
    if (rankList && homeData) {
      this.rankLists = rankList
      this.parseHomeData(homeData)
    } else {
      Promise.all([home(), rankListAll(), rankListRising()]).then(responses => {
        console.log(responses)
        let homeResponse = responses[0]
        let allResponse = responses[1]
        let risingResponse = responses[2]
        if (homeResponse.status === 200 && homeResponse.data) {
          this.parseHomeData(homeResponse.data)
          saveHome(homeResponse.data)
        }
        if (allResponse.status === 200 && allResponse.data) {
          this.parseAllData(allResponse.data)
        }
        if (risingResponse.status === 200 && risingResponse.data) {
          this.parseRisingData(risingResponse.data)
        }
        this.$nextTick(() => {
          if (this.bookListOffsetY) {
            this.$refs.bookListWrapper.scrollTo(0, this.bookListOffsetY)
          }
        })
        saveRankList(this.parseRankList())
      })
    }
    // const home = getHome()
    // if (home) {
    //   this.parseHomeData(home)
    // } else {
    //   home2().then(response => {
    //     console.log(response)
    //     if (response.status === 200 && response.data) {
    //       this.parseHomeData(response.data)
    //       saveHome(response.data)
    //     }
    //   })
    // }
    this.$refs.bookListWrapper.style.height = window.innerHeight - realPx(52) + 'px'
    this.$refs.bookListWrapper.addEventListener('scroll', this.handleBookListScroll)
    this.bookListOffsetY = getLocalStorage('offsetY')
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (from.path === '/book-store/list' && from.query.keyword) {
  //       vm.ifShowSearchPage = true
  //       vm.$refs.searchBar.setKeyword(from.query.keyword)
  //     }
  //   })
  // },
  beforeDestroy () {
    if (this.bookListOffsetY && !this.isBack) {
      setLocalStorage('offsetY', this.bookListOffsetY)
    } else {
      setLocalStorage('offsetY', 0)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .mall-home {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: px2rem(16);
    color: #666;
    .book-list-wrapper {
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
      .recommend {
        margin-top: px2rem(20);
        background: white;
      }
      .featured {
        margin-top: px2rem(20);
        background: #fafafa;
      }
      .category-list-wrapper {
        margin-top: px2rem(20);
      }
      .category {
        display: block;
      }
    }
  }
</style>
