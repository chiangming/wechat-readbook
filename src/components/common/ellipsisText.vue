<template>
  <div>
    <div :class="showTotal ? 'total-introduce' : 'detailed-introduce'">
      <div class="intro-content" :title="introduce" ref="desc">
        <span class="merchant-desc" v-if="introduce">
          {{introduce}}
        </span>
        <div class="unfold" @click="showTotalIntro" v-if="showExchangeButton">
          <span>{{exchangeButton ? '展开' : '收起'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spread',
  props: {
    text: String
  },
  data () {
    return {
      introduce: '',
      // 是否展示所有文本内容
      showTotal: true,
      // 显示展开还是收起
      exchangeButton: true,
      // 是否显示展开收起按钮
      showExchangeButton: false,
      rem: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    showTotalIntro () {
      // console.log(this.showTotal)
      this.showTotal = !this.showTotal
      this.exchangeButton = !this.exchangeButton
    },
    getRem () {
      // console.log('getRem')
      const defaultRem = 16
      let winWidth = window.innerWidth
      // console.log('winWidth:' + winWidth)
      let rem = winWidth / 375 * defaultRem
      return rem
    },
    init () {
      this.introduce = this.text
    }
  },
  watch: {
    'introduce': function () {
      this.$nextTick(function () {
        // console.log('nextTick')
        // 判断介绍是否超过四行
        let rem = parseFloat(this.getRem())
        // console.log('watch 中的rem', rem)
        if (!this.$refs.desc) {
          // console.log('desc null')
          return
        }
        let descHeight = window.getComputedStyle(this.$refs.desc).height.replace('px', '')
        // console.log('descHeight:' + descHeight)
        // console.log('如果 descHeight 超过' + (5.25 * rem) + '就要显示展开按钮')
        if (descHeight > 5.25 * rem) {
          // console.log('超过了四行')
          // 显示展开收起按钮
          this.showExchangeButton = true
          this.exchangeButton = true
          // 不是显示所有
          this.showTotal = false
        } else {
          // 不显示展开收起按钮
          this.showExchangeButton = false
          // 没有超过四行就显示所有
          this.showTotal = true
          // console.log('showExchangeButton', this.showExchangeButton)
          // console.log('showTotal', this.showTotal)
        }
      }.bind(this))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .total-introduce {
    height: auto;
    overflow: hidden;
    font-size: 16px;
    color: #747474;
    background: #ffffff;
    .intro-content {
      .merchant-desc {
        width: 100%;
        line-height: 24px;
      }
    }
    .unfold {
      display: block;
      z-index: 11;
      float: right;
      height: 24px;
      span {
        margin: 0;
        line-height: 24px;
        padding-left: 48px;
        background: linear-gradient(90deg, rgba(31, 32, 34, 0), #ffffff 50%, #ffffff);
        transition: background-image 0.2s ease-in-out 0s;
      }
    }
  }
  .detailed-introduce {
    font-size: 16px;
    color: #747474;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    .intro-content {
      // 最大高度设为4倍的行间距
      max-height: 96px;
      line-height: 24px;
      word-wrap: break-word;
      /*强制打散字符*/
      word-break: break-all;
      overflow: hidden;
      .merchant-desc {
        width: 100%;
        line-height: 24px;
      }
      &:after,{
        content: attr(title);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        color: #747474;
        // overflow: hidden;
      }
      &:after {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 96px;
        /*截取行数*/
        -webkit-line-clamp: 4;
        text-overflow: ellipsis;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .unfold {
        z-index: 11;
        height: 24px;
        outline: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        span {
          margin: 0;
          line-height: 24px;
          padding-left: 48px;
          background: linear-gradient(90deg, rgba(31, 32, 34, 0), #ffffff 50%, #ffffff);
          transition: background-image 0.2s ease-in-out 0s;
        }
      }
    }
  }
</style>
