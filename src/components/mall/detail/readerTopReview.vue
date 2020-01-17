<template>
  <div class="reader_topReview_contianer reader_bookReviewList">
    <div class="reader_topReview_header">
      <p class="reader_topReview_title">精彩点评</p>
      <div class="review_starControl_container reader_topReview_starControl">
        <p class="review_starControl_title" style="text-align: right;">为此书评分</p>
        <div class="review_starControl_content" style="width: 136px; height: 24px;">
          <div class="review_starControl_normal">
            <span data-index="1" class="normal_starItem"></span>
            <span data-index="2" class="normal_starItem"></span>
            <span data-index="3" class="normal_starItem"></span>
            <span data-index="4" class="normal_starItem"></span>
            <span data-index="5" class="normal_starItem"></span>
          </div>
          <div class="review_starControl_selected">
            <span data-index="1" class="selected_starItem_Placeholder" @click = "setMyScore(1)"></span>
            <span data-index="2" class="selected_starItem_Placeholder" @click = "setMyScore(2)"></span>
            <span data-index="3" class="selected_starItem_Placeholder" @click = "setMyScore(3)"></span>
            <span data-index="4" class="selected_starItem_Placeholder" @click = "setMyScore(4)"></span>
            <span data-index="5" class="selected_starItem_Placeholder" @click = "setMyScore(5)"></span>
          </div>
        </div>
      </div>
    </div>
  <div class="reader_topReview_randering" v-if="ifRandering">
    <div class="randering_item">
      <div class="title">
        <div class="avatar"></div>
        <div class="name"></div>
      </div>
      <div class="comment">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </div>
    <div class="randering_item">
      <div class="title">
        <div class="avatar"></div>
        <div class="name"></div>
      </div>
      <div class="comment">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </div>
    <div class="randering_item">
      <div class="title">
        <div class="avatar"></div>
        <div class="name"></div>
      </div>
      <div class="comment">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </div>
  </div>
  <div class="reader_topReview_content" v-if="!ifRandering">
    <div class="reader_topReview_item" v-for="(item,index) in commentsList" :key="index">
      <div class="title">
        <div class="wr_avatar avatar">
          <img v-lazy="item.guestAvatar" :key="item.id" class="wr_avatar_img">
        </div>
        <span class="name">{{item.guestName}}</span>
        <span class="action">点评</span>
        <span class="star">
          <span class="star-after" :style="{ width:starWidth(item.score) }"></span>
        </span>
      </div>
      <ellipsis-text :text="item.message"></ellipsis-text>
    </div>
  </div>
  <div class="reader_topReview_footer" v-if="!ifRandering">
    <span class="reader_topReview_more" @click ="showMoreComment()" v-if="ifShowMoreComment">查看更多精彩评论</span>
    <span class="reader_topReview_more" v-if="!ifShowMoreComment">没有更多评论</span>
  </div>
  <div class="wr_dialog" v-show="ifComment">
    <div class="wr_dialog_mask"></div>
    <div class="wr_dialog_container writeReview_dialog_container">
      <span href="javascript:" class="wr_dialog_closeButton" @click = "closeComment">close</span>
      <div class="writeReview_dialog_header">
        <div class="review_starControl_container writeReview_dialog_starControl">
          <p class="review_starControl_title" style="text-align: left;">评分</p>
          <div class="review_starControl_content" style="width: 136px; height: 24px;">
            <div class="review_starControl_normal">
              <span data-index="1" class="normal_starItem"></span>
              <span data-index="2" class="normal_starItem"></span>
              <span data-index="3" class="normal_starItem"></span>
              <span data-index="4" class="normal_starItem"></span>
              <span data-index="5" class="normal_starItem"></span>
            </div>
            <div class="review_starControl_selected">
              <span data-index="1" :class="[myScore >= 1?'selected_starItem':'selected_starItem_Placeholder']" @click = "setMyScore(1)"></span>
              <span data-index="2" :class="[myScore >= 2?'selected_starItem':'selected_starItem_Placeholder']" @click = "setMyScore(2)"></span>
              <span data-index="3" :class="[myScore >= 3?'selected_starItem':'selected_starItem_Placeholder']" @click = "setMyScore(3)"></span>
              <span data-index="4" :class="[myScore >= 4?'selected_starItem':'selected_starItem_Placeholder']" @click = "setMyScore(4)"></span>
              <span data-index="5" :class="[myScore >= 5?'selected_starItem':'selected_starItem_Placeholder']" @click = "setMyScore(5)"></span>
            </div>
          </div>
        </div>
        <div class="writeReview_dialog_clear"></div>
      </div>
      <div class="writeReview_dialog_content">
        <div class="writeReview_container writeReview_dialog_panel">
          <div class="writeReview_editor">
            <textarea v-model="message" name="WriteBookReview" id="WriteBookReview" placeholder="点评这本书..." class="writeReview_textarea"></textarea>
          </div>
          <div class="writeReview_footer">
            <div class="writeReview_footer_Border">
                <span @click="publish" class="writeReview_submit_button wr_btn wr_btn_Big">发 表</span>
                <div class="writeReview_footer_Clear"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script type="text/ecmascript-6">
import { comment, getComments } from '@/api/mall'
import { realPx } from '@/utils/utils'
import EllipsisText from '@/components/common/ellipsisText'

export default {
  props: {
    cover: String,
    title: String,
    author: String,
    desc: String,
    fileName: String
  },
  components: {
    EllipsisText
  },
  data () {
    return {
      myScore: 0,
      ifComment: false,
      message: '',
      commentPageSize: 3,
      commentCurrentPage: 1,
      maxCommentSize: 0,
      guestAvatar: '',
      guestName: '',
      commentsList: [],
      ifNoMoreComment: false,
      ifRandering: true
    }
  },
  computed: {
    ifShowMoreComment () {
      return this.commentsList && this.commentsList.length > 0 && !this.ifNoMoreComment
    }
  },
  methods: {
    setMyScore (index) {
      this.myScore = index
      this.ifComment = true
    },
    closeComment () {
      this.ifComment = false
      this.message = ''
      this.myScore = 0
    },
    publish () {
      if (this.message && this.message.length > 0) {
        let item = {}
        item.score = this.myScore * 20
        item.message = this.message
        item.guestName = this.guestName
        item.guestAvatar = this.guestAvatar
        item.fileName = this.$route.query.fileName
        comment(item).then(response => {
          if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
            this.$emit('showToast', response.data.msg)
            this.commentsList.unshift(item)
          } else {
            this.$emit('showToast', response.data.msg)
          }
        })
        this.closeComment()
        this.$forceUpdate()
      } else {
        this.$emit('showToast', '请点评这本书...')
      }
    },
    showMoreComment () {
      this.commentCurrentPage++
      let fileName = this.fileName
      let beforeSize = (this.commentCurrentPage - 1) * this.commentPageSize
      let pageSize = this.commentPageSize
      // console.log(`select * from comment where fileName = ?  limit ?,?`, [fileName, beforeSize, pageSize])
      let that = this
      getComments(fileName, beforeSize, pageSize).then(function (response) {
        if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
          const result = response.data.data
          if (result.length === 0) {
            that.ifNoMoreComment = true
          }
          that.commentsList.push(...result)
        } else {
          // console.log(response.data.msg)
        }
      })
    },
    starWidth (score) {
      return realPx(score * 0.78) + 'px'
    },
    checkLogin () {
      // 获取token和用户信息
      let token = window.localStorage.getItem('GITHUB_LOGIN_TOKEN')
      let guestStr = window.localStorage.getItem('GITHUB_LOGIN_GUEST')
      let guest = guestStr !== '' ? JSON.parse(guestStr) : null
      if (token && guest) {
        this.guestAvatar = guest.avatar
        this.guestName = guest.userName
        this.isLogin = true
      }
    }
  },
  watch: {
    fileName: {
      handler: function (newVal, oldVal) {
        let that = this
        getComments(newVal, 0, 3).then(function (response) {
          if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
            const result = response.data.data
            that.commentsList.push(...result)
          } else {
            // console.log(response.data.msg)
          }
          that.ifRandering = false
        })
      },
      deep: true
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";
  .reader_topReview_contianer {
    padding-left: px2rem(24);
    padding-right: px2rem(24);
    padding-top: px2rem(24);
    background: #fff;
    margin-top:px2rem(0);
    .reader_topReview_header {
        overflow: hidden;
        margin-bottom: px2rem(10);
        .reader_topReview_title {
            font-size: px2rem(20);
            font-family: "SourceHanSerifCN-Bold",STZhongsong;
            color: #2d2d2d;
        }
        .reader_topReview_starControl {
            margin-top: - px2rem(20);
            float: right;
            .review_starControl_title {
                margin-bottom: px2rem(8);
                font-size: px2rem(14);
                color: #8a8c90;
            }
            .review_starControl_content {
                position: relative;
                cursor: pointer;
                width: px2rem(136);
                height: px2rem(24);
                padding-bottom: px2rem(24);
                .review_starControl_normal, .review_starControl_selected {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
                .review_starControl_normal {
                    z-index: 1;
                }
                .review_starControl_selected {
                    z-index: 2;
                }
            }
        }
    }
    .reader_topReview_randering{
      width:100%;
      .title{
        .avatar {
          width: 18px!important;
          height: 18px!important;
          display: inline-block!important;
          margin-right: 6px;
          background-color: #f1f3f6;
        }
        .name {
                width: 150px!important;
                height: 18px!important;
                display: inline-block;
                margin-right: px2rem(8);
                background-color: #f1f3f6;
        }
        .star {
                width: 100px!important;
                height: 18px!important;
                display: inline-block;
                margin-right: px2rem(8);
                background-color: #f1f3f6;
        }
      }
      .comment{
        line-height: 11px;
        .line1{
          width: 100%!important;
          height: 18px!important;
          display: inline-block;
          margin-right: px2rem(8);
          background-color: #f1f3f6;
        }
        .line2{
          width: 100%!important;
          height: 18px!important;
          display: inline-block;
          margin-right: px2rem(8);
          background-color: #f1f3f6;
        }
        .line3{
          width: 80%!important;
          height: 18px!important;
          display: inline-block;
          margin-right: px2rem(8);
          background-color: #f1f3f6;
        }
      }
    }
    .reader_topReview_content{
      .reader_topReview_item {
          margin-bottom: px2rem(32);
          .title{
            .avatar {
                width: 18px!important;
                height: 18px!important;
                display: inline-block!important;
                vertical-align: middle!important;
                margin-top: -2px;
                margin-right: 6px;
                .wr_avatar_img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    vertical-align: top;
                }
            }
            .name {
                font-size: px2rem(14);
                font-weight: 700;
                display: inline-block;
                vertical-align: middle;
                margin-right: px2rem(8);
                color: #8a8c90;
            }
            .action {
                font-size: 14px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                color: #626468;
            }
            .star {
                display: inline-block;
                width: 78px;
                height: 14px;
                white-space: nowrap;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 16px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 32px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 48px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 64px 0 no-repeat;
                background-size: 14px 14px;
                vertical-align: middle;
            }
            .star-after {
                display: inline-block;
                vertical-align: top;
                height: 14px;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 16px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 32px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 48px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 64px 0 no-repeat;
                background-size: 14px 14px;
            }
          }
          .content {
            position: relative;
            overflow: hidden;
            display: -webkit-box;
            display: -moz-box;
            text-overflow: ellipsis;
            -webkit-line-clamp: 5;
            -moz-line-clamp: 5;
            line-clamp: 5;
            -webkit-box-orient: vertical;
            -webkit-text-size-adjust: none;
            box-orient: vertical;
            height: auto;
            max-height: 130px;
            margin-top: 10px;
            line-height: 26px;
            font-size: 16px;
            text-align: justify;
            background: #fff!important;
            color: #747474;
          }
      }

    }
    .reader_topReview_footer {
        padding: 0 0 px2rem(40);
        border-radius: 0;
        border: solid hsla(0,0%,100%,.05);
        border-width: 0 0 1px;
        .reader_topReview_more {
            font-size: 15px;
            font-weight: 700;
            color: #0097ff;
        }
    }
    .wr_dialog {
      position: fixed;
      z-index: 90;
      .wr_dialog_mask {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        position: fixed;
        z-index: 90;
      }
      .writeReview_dialog_container {
            width: 80%;
            max-width: 600px;
            height: 80%;
            max-height: 600px;
            background-color: rgba(50,50,50,.8);
            -webkit-backdrop-filter: blur(40px);
            backdrop-filter: blur(40px);
            position: fixed;
            overflow: hidden;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 100;
            border-radius: 12px;
            text-align: center;
            background-color: #ffffff;
            .wr_dialog_closeButton {
                position: absolute;
                right: 16px;
                top: 16px;
                width: 20px;
                height: 20px;
                text-indent: -9999em;
                overflow: hidden;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/dialog_close.a5f40ec8.png) no-repeat;
                background-size: 100%;
            }
            .writeReview_dialog_header {
                position: relative;
                border: 0;
                margin: 36px 24px 0;
                padding-bottom: 24px;
                border-width: 0 0 1px;
                &:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 200%;
                    height: 200%;
                    border-radius: 0;
                    border: solid hsla(0,0%,100%,.05);
                    border-width: 0 0 1px;
                    transform: scale(.5);
                    transform-origin: 0 0;
                    pointer-events: none;
                }
                .writeReview_dialog_starControl {
                    float: left;
                    .review_starControl_title {
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: #8a8c90;
                    }
                    .review_starControl_content {
                      width: 136px;
                      height: 24px;
                      position: relative;
                      cursor: pointer;
                    }
                }
                .writeReview_dialog_clear {
                    width: 100%;
                    clear: both;
                }
            }
            .writeReview_dialog_content {
                position: absolute;
                left: 0;
                right: 0;
                top: 114px;
                bottom: 0;
                .writeReview_container {
                    text-align: left;
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    .writeReview_editor {
                        position: absolute;
                        top: 0;
                        bottom: 100px;
                        left: 0;
                        right: 0;
                        .writeReview_textarea {
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                            border: 0;
                            font-size: 17px;
                            line-height: 28px;
                            resize: none;
                            padding: 15px 24px 0;
                            box-sizing: border-box;
                            color: #111;
                            outline: none;
                            -webkit-tap-highlight-color: rgba(0,0,0,0);
                        }
                    }
                    .writeReview_footer {
                        position: absolute;
                        bottom: 0;
                        left: 24px;
                        right: 24px;
                        &:after {
                            content: "";
                            display: block;
                            clear: both;
                        }
                        .writeReview_footer_Border {
                            position: relative;
                            border: 0;
                            padding: 24px 0;
                            border-radius: 0;
                            border: solid rgba(0, 0, 0, 0.05);
                            border-width: 1px 0 0;
                            .writeReview_submit_button {
                              position: absolute;
                              right:0px;
                              bottom:11px;
                              line-height: 32px;
                              display: block;
                              height: 28px;
                              padding: 0 15px;
                              min-width: 34px;
                              font-size: 13px;
                              font-weight: 500;
                              text-align: center;
                              background: linear-gradient(90deg,#0087fc,#28b7ff);
                              border-radius: 14px;
                              color: #fff!important;
                              -webkit-user-select: none;
                              -moz-user-select: none;
                              -ms-user-select: none;
                              user-select: none;
                            }
                        }
                    }
                }
            }
      }
    }
  }
  .normal_starItem {
      background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/review_blue_star.93f13e0c.png) no-repeat;
      background-size: 100%;
  }

  .selected_starItem {
      background-image: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/review_blue_star_selected_2x.7e6e2f5e.png);
      background-size: 100%;
  }

  .normal_starItem, .selected_starItem, .selected_starItem_Placeholder {
      width: 24px;
      height: 24px;
  }

  .review_starControl_normal {
      z-index: 1;
  }
  .review_starControl_selected {
      z-index: 2;
  }
  .review_starControl_normal, .review_starControl_selected {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
  }

</style>
