<template>
  <div class="guess-you-like">
    <title-view :label="$t('category.contemporary')"></title-view>
    <slide :slideData="data" :slideWidth="width"></slide>
    <button-view :btn="$t('home.change')" @onClick="change"></button-view>
  </div>
</template>

<script type="text/ecmascript-6">
import TitleView from '@/components/mall/home/layout/title'
import ButtonView from '@/components/mall/home/layout/button'
import { detailMixin } from '@/utils/mixin'
import Slide from '@components/mall/home/layout/slide.vue'

export default {
  mixins: [detailMixin],
  components: {
    TitleView,
    ButtonView,
    Slide
  },
  props: {
    data: Array
  },
  watch: {
    data (v) {
      this.total = Math.floor(v.length / 3)
    }
  },
  computed: {
    width () {
      // console.log(window.innerWidth)
      return window.innerWidth
    },
    showData () {
      if (this.data) {
        return [
          this.data[this.index],
          this.data[this.index + this.total],
          this.data[this.index + this.total * 2]
        ]
      } else {
        return []
      }
    }
  },
  data () {
    return {
      index: 0,
      total: 0
    }
  },
  methods: {
    // coverUrl (item) {
    //   if (item.categoryText && item.cover) {
    //     return `${process.env.VUE_APP_IMGS_URL}/${item.categoryText}/${item.cover}`
    //   } else {
    //     // todo: 添加默认图片
    //   }
    // },
    change () {
      if (this.index + 1 >= this.total) {
        this.index = 0
      } else {
        this.index++
      }
    },
    resultText (item) {
      if (item && item.type && item.result) {
        switch (item.type) {
          case 1:
            return this.$t('home.sameAuthor').replace('$1', item.result)
          case 2:
            return this.$t('home.sameReader').replace('$1', item.result)
          case 3:
            return this.$t('home.readPercent').replace('$1', item.percent).replace('$2', item.result)
        }
      }
    },
    resize () {
      this.$nextTick(() => {
        this.$refs.title.forEach(item => {
          item.style.width = this.width
        })
        this.$refs.author.forEach(item => {
          item.style.width = this.width
        })
        this.$refs.result.forEach(item => {
          item.style.width = this.width
        })
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../../assets/styles/global";

  .guess-you-like {
    .guess-you-like-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .guess-you-like-item {
        display: flex;
        &:first-child {
          margin-top: px2rem(0);
        }
        .img-wrapper {
          flex: 0 0 20%;
          padding: px2rem(10) px2rem(10) px2rem(10) 0;
          box-sizing: border-box;
          .img {
            width: 100%;
          }
        }
        .content-wrapper {
          flex: 1;
          padding: px2rem(10) 0;
          box-sizing: border-box;
          .title {
            line-height: px2rem(36);
          }
          .author {
            margin-top: px2rem(15);
          }
          .result {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
