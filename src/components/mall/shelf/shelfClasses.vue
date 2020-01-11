<template>
  <div class="shelf-search-wrapper" :class="{'search-top': ifShowCategory, 'hide-shadow': ifHideShadow}">
    <div class="computer-hint-wrapper" v-show="!ifShowCategory">
      <span class="icon-computer"></span>
      <span class="hint-text">电脑版</span>
    </div>
    <div class="class-hint-wrapper" v-show="!ifShowCategory" @click="showCategory">
      <span class="icon-category"></span>
      <span class="hint-text">分类显示</span>
    </div>
    <transition name="shelf-tab-slide-left">
      <div class="tab-wrapper" v-if="ifShowCategory">
        <div class="tab-item" v-for="(item, index) in tabs" :key="index" @click="onTabClick(item)">
          <span class="tab-item-text" :class="{'is-selected': item.selected}" v-if="showShadow">{{item.text}}</span>
        </div>
        <div class="tab-item">
          <span class="icon-close" @click="hideCategory"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    tabs () {
      return [
        {
          id: 1,
          text: this.$t('shelf.default'),
          selected: true
        },
        {
          id: 2,
          text: this.$t('shelf.progress'),
          selected: false
        },
        {
          id: 3,
          text: this.$t('shelf.purchase'),
          selected: false
        }
      ]
    }
  },
  data () {
    return {
      ifShowCategory: false,
      ifHideShadow: true
    }
  },
  methods: {
    showCategory () {
      this.ifShowCategory = true
    },
    hideCategory () {
      this.ifShowCategory = false
      this.$emit('onTabClick', 0)
    },
    onTabClick (item) {
      this.tabs.forEach(tab => {
        if (tab.id === item.id) {
          tab.selected = true
        } else {
          tab.selected = false
        }
      })
      this.$emit('onTabClick', item.id)
      this.$forceUpdate()
    },
    showShadow () {
      this.ifHideShadow = false
    },
    hideShadow () {
      this.ifHideShadow = true
    },
    onCancel () {
      this.$emit('onCancel')
      this.ifShowCancel = false
    },
    onSearchClick () {
      this.$emit('onSearchClick')
      this.ifShowCancel = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";

  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(42);
    font-size: px2rem(16);
    padding: 0 px2rem(10);
    box-sizing: border-box;
    background: white;
    display: flex;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    .computer-hint-wrapper{
      flex: 1;
      @include left;
      height: px2rem(42);
      font-size: px2rem(14);
      margin-left: px2rem(10);
      color: #555;
      .hint-text{
        margin: 0 px2rem(5);
        font-weight: bold;
      }
    }
    .class-hint-wrapper{
      flex: 1;
      @include right;
      height: px2rem(42);
      font-size: px2rem(14);
      margin-right: px2rem(10);
      color: #555;
      .icon-category{
        font-size: px2rem(16);
      }
      .hint-text{
        margin: 0 px2rem(5);
        font-weight: bold;
      }
    }
    .tab-wrapper {
      position: absolute;
      top: px2rem(0);
      left: 0;
      z-index: 100;
      display: flex;
      width: 100%;
      height: px2rem(42);
      .tab-item {
        flex: 1;
        @include center;
        .tab-item-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
