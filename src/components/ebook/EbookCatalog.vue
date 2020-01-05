<template>
  <transition name="fade">
    <div class="catalog-content-wrapper" v-show="settingVisible === 3 || settingVisible === 4">
      <div class="content-bg" v-if="settingVisible === 3 || settingVisible === 4" @click="hideMenuVisible()"></div>
      <transition name="slide-right">
        <div class="content" v-if="settingVisible === 3 || settingVisible === 4">
          <div class="content-page-wrapper" v-if="!isPaginating">
            <div class="content-page">
              <keep-alive>
                <component :is="tab === 1 ? content : bookmark"></component>
              </keep-alive>
            </div>
            <div class="content-page-tab">
              <div class="content-page-tab-item"
                   :class="{'selected': tab === 1}"
                   @click="selectTab(1)">{{$t('book.navigation')}}
              </div>
              <div class="content-page-tab-item"
                   :class="{'selected': tab === 2}"
                   @click="selectTab(2)">{{$t('book.bookmark')}}
              </div>
            </div>
          </div>
          <div class="empty" v-else>
             <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import EbookLoading from './slide/EbookLoading'
import EbookContent from './slide/EbookSlideContent'
import EbookBookmark from './slide/EbookSlideBookmark'
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  components: {
    EbookLoading
  },
  data () {
    return {
      tab: 1,
      content: EbookContent,
      bookmark: EbookBookmark
    }
  },
  methods: {
    selectTab (tab) {
      this.tab = tab
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .catalog-content-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 350;
    display: flex;
    flex-direction:column;
    background: rgba(0,0,0,0.1);
    width: 100%;
    $toheight:px2rem(48);
    height: calc(100% - #{$toheight});
    .content-bg {
      flex: 0 0 px2rem(48);
      width: 100%;
      height: px2rem(48);
    }
    .content {
      flex: 0 0 calc(100% - #{$toheight});
      width: 100%;
      height: calc(100% - #{$toheight});
      border-radius: px2rem(30) px2rem(30) 0 0;
      .content-page-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .content-page {
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab {
          display: flex;
          flex: 0 0 px2rem(48);
          .content-page-tab-item {
            flex: 1;
            font-size: px2rem(12);
            @include center;
          }
        }
      }
      .empty {
        width: 100%;
        height: 100%;
        @include center;
        font-size: px2rem(16);
        color: #333;
      }
    }
  }
</style>
