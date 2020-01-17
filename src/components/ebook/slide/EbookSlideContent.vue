<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img v-lazy="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTime()}}</div>
      </div>
    </div>
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input class="slide-contents-search-input"
               type="text"
               :placeholder="$t('book.searchHint')"
               @click="showSearchPage()"
               v-model="searchText"
               @keyup.enter="search()"
               ref="searchInput">
      </div>
      <div class="slide-contents-search-cancel" v-if="searchVisible"
           @click="hideSearchPage()">{{$t('book.cancel')}}
      </div>
    </div>
    <scroll class="slide-contents-list" :top="145" :bottom="48" ref="scroll" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index" @click="display(item.href)">
        <span class="slide-contents-item-label" :class="{'selected': section === index}" :style="contentItemStyle(item)">{{item.label.trim()}}</span>
        <span class="slide-contents-item-page">{{item.page}}</span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="48" :bottom="48" ref="scroll" v-show="searchVisible">
      <div class="slide-search-item" v-for="(item, index) in searchList"
           :key="index" v-html="item.excerpt" @click="display(item.cfi, true)">
      </div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '../../../utils/mixin'
import { px2rem } from '../../../utils/utils'
import Scroll from '../../common/scroll'

export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data () {
    return {
      searchText: '',
      searchVisible: false,
      searchList: null
    }
  },
  methods: {
    contentItemStyle (item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}`
      }
    },
    showSearchPage () {
      this.searchVisible = true
    },
    hideSearchPage () {
      this.searchVisible = false
    },
    search () {
      this.doSearch(this.searchText).then(result => {
        this.searchList = result.map(item => {
          item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
          return item
        })
        this.$refs.searchInput.blur()
      })
    },
    doSearch (q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(
          item => item.load(this.currentBook.load.bind(this.currentBook)).then(item.find.bind(item, q)).finally(item.unload.bind(item)))
      ).then(results => Promise.resolve([].concat.apply([], results)))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";
  .ebook-slide-contents {
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-search-input-wrapper {
        flex: 1;
        border-radius: px2rem(15);
        @include center;
        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          @include center;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(90);
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      box-sizing: border-box;
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        box-sizing: border-box;
        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
          background: red;
        }
      }
      .slide-contents-book-info-wrapper {
        flex: 1;
        @include columnLeft;
        .slide-contents-book-title {
          font-size: px2rem(14);
          line-height: px2rem(16);
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include left;
          .slide-contents-book-title-text {
            @include ellipsis2(1);
          }
        }
        .slide-contents-book-author {
          font-size: px2rem(12);
          line-height: px2rem(14);
          padding: 0 px2rem(10);
          box-sizing: border-box;
          margin-top: px2rem(5);
          @include left;
          .slide-contents-book-author-text {
            @include ellipsis2(1);
          }
        }
      }
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        @include columnLeft;
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
            line-height: px2rem(16);
          }
          .progress-text {
            font-size: px2rem(12);
            line-height: px2rem(14);
            margin-left: px2rem(2);
          }
        }
        .slide-contents-book-time {
          font-size: px2rem(12);
          line-height: px2rem(14);
          margin-top: px2rem(5);
        }
      }
    }
    .slide-contents-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item {
        display: flex;
        padding: px2rem(20) 0;
        box-sizing: border-box;
        .slide-contents-item-label {
          flex: 1;
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis;
        }
        .slide-contents-item-page {
          flex: 0 0 px2rem(30);
          font-size: px2rem(10);
          @include right;
        }
      }
    }
    .slide-search-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-search-item {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>
