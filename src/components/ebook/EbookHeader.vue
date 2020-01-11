<template>
  <div class="ebook-header">
    <span class="ebook-header-text">{{getHeaderName}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  computed: {
    getHeaderName () {
      if (this.section && this.navigation) {
        if (this.navigation[this.section] && this.navigation[this.section].label) {
          return this.navigation[this.section].label
        }
        return `第${this.section + 1}章`
      }
      return '章节名 '
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow: hidden;
    @include left;
    .ebook-header-text {
      font-size: px2rem(12);
      color: #6d7178;
    }
  }
</style>
