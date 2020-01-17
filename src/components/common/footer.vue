<template>
  <div class="common-footer">
    <div class="common-tab-wrapper" v-for="(item, index) in tabs" :key="index" @click="onTabClick(item)">
      <div class="common-tab">
        <div class="tab-icon" :class="{'tab-icon-discovery': !isSelected(item.index),'tab-icon-discovery-active': isSelected(item.index)}" v-if="item.index === 1"></div>
        <div class="tab-icon" :class="{'tab-icon-book': !isSelected(item.index),'tab-icon-book-active': isSelected(item.index)}" v-if="item.index === 2"></div>
        <div class="tab-icon" :class="{'tab-icon-story': !isSelected(item.index),'tab-icon-story-active': isSelected(item.index)}" v-if="item.index === 3"></div>
        <div class="tab-icon" :class="{'tab-icon-profile': !isSelected(item.index),'tab-icon-profile-active': isSelected(item.index)}" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'is-selected': isSelected(item.index)}">{{item.label}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    selectIndex: Number
  },
  computed: {
    tabs () {
      return [
        {
          label: this.$t('footer.discover'),
          index: 1
        },
        {
          label: this.$t('footer.shelf'),
          index: 2
        },
        {
          label: this.$t('footer.story'),
          index: 3
        },
        {
          label: this.$t('footer.profile'),
          index: 4
        }
      ]
    }
  },
  methods: {
    isSelected (index) {
      return this.selectIndex === index
    },
    gotoDiscovry () {
      this.$router.push('/discovery')
    },
    gotoShelf () {
      this.$router.push('/mall')
    },
    gotoStory () {
      this.$router.push('/story')
    },
    gotoProfile () {
      this.$router.push('/profile')
    },
    onTabClick (item) {
      if (item.index === 1) {
        if (this.selectIndex !== 1) {
          this.gotoDiscovry()
        } else {
          this.$emit('firstPage')
        }
      } else if (item.index === 2 && this.selectIndex !== 2) {
        this.gotoShelf()
      } else if (item.index === 3 && this.selectIndex !== 3) {
        this.gotoStory()
      } else if (item.index === 4 && this.selectIndex !== 4) {
        this.gotoProfile()
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .common-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .common-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .common-tab {
        width: 100%;
        height: 100%;
        @include columnCenter;
        .tab-icon {
          height: px2rem(30);
          width: px2rem(30);
          background-size: 100% 100%;
          &.tab-icon-discovery {
            background-image:url("../../assets/images/icon-discovery.jpg");
          }
          &.tab-icon-book {
            background-image:url("../../assets/images/icon-book.jpg");
          }
          &.tab-icon-story {
            background-image:url("../../assets/images/icon-story.jpg");
          }
          &.tab-icon-profile {
            background-image:url("../../assets/images/icon-profile.jpg");
          }
          &.tab-icon-discovery-active {
            background-image:url("../../assets/images/icon-discovery-active.jpg");
          }
          &.tab-icon-book-active {
            background-image:url("../../assets/images/icon-book-active.jpg");
          }
          &.tab-icon-story-active {
            background-image:url("../../assets/images/icon-discovery-active.jpg");
          }
          &.tab-icon-profile-active {
            background-image:url("../../assets/images/icon-profile-active.jpg");
          }
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #000;
          opacity: .5;
          &.remove-text {
            color: $color-pink;
          }
          &.is-selected {
            opacity: 1;
            color:#1e8eee;
          }
        }
      }
    }
  }
</style>
