<template>
  <div class="mall-home">
    <search-bar @showFlapCard="showFlapCard"
                :ifShowSearchPage.sync="ifShowSearchPage"
                :ifShowHotSearch.sync="ifShowHotSearch"
                :bookListOffsetY="bookListOffsetY"
                @back="onBack"
                ref="searchBar"></search-bar>
    <div class="book-list-wrapper" v-show="!ifShowSearchPage || !ifShowHotSearch" ref="bookListWrapper">
      <!-- <guess-you-like :data="guessYouLike" ref="guessYouLike"></guess-you-like> -->
      <!-- <rank :data="guessYouLike" ref="rank"></rank> -->
      <!-- <recommend class="recommend" :data="recommend" ref="recommend"></recommend> -->
      <!-- <featured class="featured" :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"
                ref="featured"></featured> -->
      <!-- <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div> -->
      <category class="category" :data="categories"></category>
      <div>
      <p v-for="n in 100" :key="n"> {{n}}1111111111111111111111111111111111111</p>
      </div>
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
// import Rank from '@/components/mall/home/module/rank'
// import GuessYouLike from '@/components/mall/home/module/guessYouLike'
// import Recommend from '@/components/mall/home/module/recommend'
// import Featured from '@/components/mall/home/module/featured'
import CategoryBook from '@/components/mall/home/module/categoryBook'
import Category from '@/components/mall/home/module/category'
import { home, categoryList } from '@/api/mall'
import { realPx } from '@/utils/utils'
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'

export default {
  components: {
    Category,
    CategoryBook,
    // Featured,
    FlapCard,
    SearchBar
    // GuessYouLike,
    // Recommend,
    // Rank
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
      bookListOffsetY: 0
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
      // this.guessYouLike = data.guessYouLike
      // this.recommend = data.recommend
      // this.featured = data.featured
      this.categoryList = data.categoryList
      this.categories = data.categories
      this.randomList = data.random
      this.$nextTick(() => {
        if (this.bookListOffsetY) {
          this.$refs.bookListWrapper.scrollTo(0, this.bookListOffsetY)
        }
      })
    }
  },
  mounted () {
    home().then(response => {
      // console.log(response)
      if (response.status === 200 && response.data) {
        this.parseHomeData(response.data)
        // saveHome(response.data)
      }
    })

    categoryList().then(response => {
      // console.log(response)
      if (response.status === 200 && response.data) {
        // console.log(response.data)
        // this.parseHomeData(response.data)
        // // saveHome(response.data)
      }
    })
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
        margin-top: px2rem(20);
      }
    }
  }
</style>
