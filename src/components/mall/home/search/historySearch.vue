<template>
  <div>
    <div class="history-search-title">
      <span class="label">{{label}}</span>
      <span class="btn" @click="clearHistory">{{btn}}</span>
    </div>
    <div class="history-search-list">
      <div class="history-search-item" v-for="(item, index) in searchList" :key="index">
        <div class="icon-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="history-search-text-wrapper">
          <div class="text" ref="searchText" @click="search(item)">{{item}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mallMixin } from '@/utils/mixin'

export default {
  mixins: [mallMixin],
  props: {
    label: String,
    btn: String
  },
  data () {
    return {}
  },
  mounted () {
    // this.$refs.searchText.forEach(item => {
    //   item.style.width = window.innerWidth - realPx(20) - realPx(40) + 'px'
    // })
  },
  methods: {
    clearHistory () {
      this.setSearchList([])
      this.$emit('clearHistory')
    },
    search (keyword) {
      this.$router.push({
        path: '/mall/list',
        query: {
          keyword: keyword
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

  .history-search-title {
    display: flex;
    width: 100%;
    font-size: px2rem(13);
    padding: px2rem(10);
    box-sizing: border-box;
    .label {
      flex: 1;
      text-align: left;
      font-weight: bold;
      color: #666;
    }
    .btn {
      flex: 1;
      text-align: right;
      font-weight: bold;
      color: #409EFF;
    }
  }
  .history-search-list {
    width: 100%;
    height: 400px;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .history-search-item {
      padding: px2rem(10) 0;
      display: flex;
      .icon-wrapper {
        flex: 0 0 px2rem(40);
        @include center;
        .icon-book {
          font-size: px2rem(16);
        }
        .icon-search {
          font-size: px2rem(16);
        }
      }
      .history-search-text-wrapper {
        flex: 1;
        height: px2rem(35);
        @include columnLeft;
        .text {
          flex: 1;
          height: 100%;
          @include ellipsis;
          @include left;
          font-size: px2rem(14);
          font-weight: bold;
          color: #666;
        }
        .num {
          font-size: px2rem(12);
          color: #999;
          margin-top: px2rem(5);
        }
      }
    }
  }
</style>
