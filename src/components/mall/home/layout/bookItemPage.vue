<template>
  <div class="book-item-page">
    <div class="book-item-page-list">
      <div class="book-item-page-item" v-for="(item, index) in data" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" v-lazy="coverUrl(item)" :key="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-big" ref="title">{{item.title}}</div>
          <div class="author sub-title" ref="author">{{item.author}}</div>
          <div class="result third-title" ref="result">{{resultText(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { realPx } from '@/utils/utils'
import { detailMixin } from '@/utils/mixin'

export default {
  mixins: [detailMixin],
  components: {
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
      return window.innerWidth - realPx(20) - realPx(60) + 'px'
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

  .book-item-page {
    width: 100%;
    .book-item-page-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .book-item-page-item {
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
          flex: 1 0 auto;
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
