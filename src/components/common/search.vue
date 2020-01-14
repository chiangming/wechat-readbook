<template>
  <div class="search-bar-wrapper">
    <div class="title-search-wrapper" :class="{'show-search': ifShowSearchPage, 'hide-shadow': ifHideShadow}" ref="titleSearchWrapper">
      <div class="search-wrapper" :class="{'show-search': ifShowSearchPage}">
        <div class="search-back-wrapper" :class="{'show-search': ifShowSearchPage}" @click="back">
          <span class="icon-back icon" :class="{'show-search': ifShowSearchPage}"></span>
        </div>
        <div class="search-bg">
          <span class="icon-search icon"></span>
          <input type="text" class="search"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @input="checkSearchText"
                 @click="onSearchClick"
                 @keyup.13.exact="search"
                 ref="searchInput">
          <slot name="button" :ifShow="ifShow"></slot>
          <div class="icon-clear-wrapper" @click="clearSearchText" v-if="ifShowClear">
            <span class="icon-close-circle-fill icon"></span>
          </div>
        </div>
      </div>
    </div>
    <transition name="host-search">
      <div class="hot-search-wrapper" v-if="ifShowSearchPage && ifShowHotSearch" ref="searchMaskWrapper">
        <hot-search></hot-search>
        <div class="line"></div>
        <history-search :label="$t('home.historySearch')"
                        :btn="$t('home.clear')"></history-search>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { realPx } from '@/utils/utils'
import HotSearch from '@/components/mall/home/search/hotSearch'
import HistorySearch from '@/components/mall/home/search/historySearch'
import { mallMixin } from '@/utils/mixin'

export default {
  mixins: [mallMixin],
  components: {
    HotSearch,
    HistorySearch
  },
  props: {
    ifShowSearchPage: {
      type: Boolean,
      default: true
    },
    ifShowHotSearch: {
      type: Boolean,
      default: true
    },
    isDataEmpty: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ifShowClear: false,
      // searchList: {
      //   hotSearch: []
      // },
      ifHideShadow: true,
      searchText: ''
    }
  },
  computed: {
    ifShow: function () {
      return !this.ifShowClear && !this.ifShowSearchPage && !this.isDataEmpty
    }
  },
  methods: {
    onEdit () {
      this.$emit('onEditClick', true)
      this.$emit('showTitle')
    },
    onSearchClick () {
      this.$emit('onSearchClick')
      this.ifShowCancel = true
      this.showSearchPageAndHotSearch()
    },
    clearSearchText () {
      this.searchText = ''
      this.checkSearchText()
      this.$refs.searchInput.focus()
    },
    checkSearchText () {
      if (this.searchText && this.searchText.length > 0) {
        this.ifShowClear = true
      } else {
        this.ifShowClear = false
      }
    },
    search () {
      let currSearchList = this.searchList || []
      currSearchList.push(this.searchText)
      this.setSearchList(currSearchList)
      this.$router.push({
        path: '/mall/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    clearHistorySearch () {
      this.searchList.historySearch = []
    },
    hideHotSearch () {
      this.$emit('update:ifShowHotSearch', false)
    },
    showShadow () {
      this.ifHideShadow = false
    },
    hideShadow () {
      this.ifHideShadow = true
    },
    showSearchPageAndHotSearch () {
      this.showSearchPage()
      this.hideShadow()
      this.$emit('update:ifShowHotSearch', true)
      this.$nextTick(() => {
        this.initHotSearch()
      })
    },
    back () {
      this.searchText = ''
      this.ifShowClear = false
      if (this.ifShowSearchPage) {
        this.hideSearchPage()
      }
    },
    hideSearchPage () {
      this.$emit('update:ifShowSearchPage', false)
      this.ifHideShadow = true
    },
    showSearchPage () {
      this.$emit('update:ifShowSearchPage', true)
    },
    handleScroll (e) {
      const target = e.target
      if (target) {
        if (target.scrollTop > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    initHotSearch () {
      if (this.$refs.searchMaskWrapper) {
        this.$refs.searchMaskWrapper.style.height = window.innerHeight - realPx(52) + 'px'
        this.$refs.searchMaskWrapper.addEventListener('scroll', this.handleScroll)
        this.$refs.searchMaskWrapper.scrollTo(0, 0)
      }
    }
  },
  beforeDestroy () {
    // setHistorySearchList(this.searchList.historySearch)
  }

}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .search-bar-wrapper {
    position: relative;
    z-index: 110;
    .title-search-wrapper {
      position: relative;
      z-index: 110;
      width: 100%;
      height: px2rem(52);
      background: white;
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
      &.show-search {
        height: px2rem(52);
      }
      &.hide-shadow {
        box-shadow: none;
      }
      .icon-back-wrapper {
        position: absolute;
        left: px2rem(10);
        top: 0;
        z-index: 110;
        height: px2rem(52);
        @include center;
        transition: all $homeAnimationTime linear;
        &.show-search {
          height: px2rem(52);
        }
      }
      .search-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        display: flex;
        padding: px2rem(10);
        width: 100%;
        box-sizing: border-box;
        transition: all $homeAnimationTime linear;
        &.show-search {
          top: 0;
        }
        .search-back-wrapper {
          flex: 0;
          width: 0;
          @include center;
          transition: all $homeAnimationTime linear;
          &.show-search {
            margin-right: px2rem(10);
            flex: 0 0 px2rem(20);
            width: px2rem(20);
          }
          .icon-back {
            font-size: 0;
            &.show-search {
              font-size: px2rem(20);
            }
          }
        }
        .search-bg {
          flex: 1;
          background: #f4f4f4;
          border-radius: px2rem(20);
          border: px2rem(1) solid #eee;
          box-sizing: border-box;
          padding: px2rem(5) px2rem(15);
          transition: all $homeAnimationTime linear;
          @include left;
          .icon-search {
            font-size: px2rem(16);
            color: #999;
          }
          .search {
            color: #666;
            width: 100%;
            height: px2rem(22);
            background: transparent;
            font-size: px2rem(12);
            margin-left: px2rem(10);
            border: none;
            &:focus {
              outline: none;
            }
            &::-webkit-input-placeholder {
              color: #ccc;
            }
          }
          .btn-edit-wrapper{
            @include right;
            width: px2rem(50);
            height: px2rem(16);
            border-left: 1px solid #c1c1c1;
            font-size: px2rem(14);
            line-height: px2rem(14);
            color: #555;
            .btn-edit-text{
              font-weight:bold;
            }
          }
          .icon-clear-wrapper {
            @include left;
            .icon-close-circle-fill {
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }
      }
    }
    .hot-search-wrapper {
      width: 100%;
      height: 100%;
      z-index: 110;
      background: white;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
      .line {
        width: 100%;
        height: 0;
        border-top: px2rem(1) solid #eee;
        margin: px2rem(10) 0;
      }
    }
  }
</style>
