<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTime()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @input="onProgressInput($event.target.value)"
                 @change="onProgressChange($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{bookAvailable ? getSectionName : $t('book.loading')}}</span>
<!--          <span class="progress-text">({{bookAvailable ? progress + '%' : $t('book.loading')}})</span>-->
        </div>
        <div class="float-block-wrapper" v-show="isFloat">
          <span class="float-block-text">{{Math.round(progress/100*(locationLength-1))+1}}/{{locationLength}}</span>
        </div>
       </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { ebookMixin } from '../../utils/mixin'
import { saveProgress } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data () {
    return {
      isProgressLoading: false,
      isFloat: false
    }
  },
  methods: {
    prevSection () {
      if (this.section > 0 && !this.isProgressLoading) {
        this.isProgressLoading = true
        this.setSection(this.section - 1).then(() => {
          this.displaySection(() => {
            this.updateProgressBg()
            this.isProgressLoading = false
          })
        })
      }
    },
    nextSection () {
      if (this.currentBook.spine.length - 1 > this.section && !this.isProgressLoading) {
        this.isProgressLoading = true
        this.setSection(this.section + 1).then(() => {
          this.displaySection(() => {
            this.updateProgressBg()
            this.isProgressLoading = false
          })
        })
      }
    },
    onProgressInput (progress) {
      this.isFloat = true
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
        this.displayProgress()
      })
    },
    onProgressChange (progress) {
      // 设置进度
      this.isFloat = false
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
        this.displayProgress()
      })
      saveProgress(this.fileName, progress)
    },
    updateProgressBg () {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
  },
  updated () {
    this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    /*height: px2rem(90);*/
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        /*position: absolute;*/
        /*left: 0;*/
        /*top: 0;*/
        width: 100%;
        height: px2rem(20);
        @include center;
        font-size: px2rem(12);
        line-height: px2rem(12);
        margin-top: px2rem(8);
        box-sizing: border-box;
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        min-height: px2rem(30);
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress {
          flex: 1;
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
          background-size: 0 100%;
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #ceced0;
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
            border: none;
          }
        }
        .progress-icon-wrapper {
          flex: 0 0 px2rem(22);
          font-size: px2rem(22);
          @include center;
        }
      }
      .text-wrapper {
        /*position: absolute;*/
        /*left: 0;*/
        /*bottom: px2rem(5);*/
        width: 100%;
        height: px2rem(15);
        font-size: px2rem(15);
        text-align: center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          line-height: px2rem(15);
          @include ellipsis;
        }
        .progress-text {
        }
      }
      .float-block-wrapper {
        position: absolute;
        left: 0;
        top: px2rem(-60);
        width: 100%;
        height: px2rem(40);
        @include center;
        font-size: px2rem(12);
        .float-block-text {
          line-height: px2rem(15);
          @include ellipsis;
          background: #444444;
          color: #b8b9bb;
          padding: px2rem(5) px2rem(10);
          border-radius: px2rem(10);
        }
      }
    }
  }
</style>
