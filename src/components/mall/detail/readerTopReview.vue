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
            <span data-index="1" class="selected_starItem_Placeholder"></span>
            <span data-index="2" class="selected_starItem_Placeholder"></span>
            <span data-index="3" class="selected_starItem_Placeholder"></span>
            <span data-index="4" class="selected_starItem_Placeholder"></span>
            <span data-index="5" class="selected_starItem_Placeholder"></span>
          </div>
        </div>
      </div>
    </div>
  <div class="reader_topReview_content">
    <div class="reader_topReview_item">
      <div class="title">
        <div class="wr_avatar avatar">
          <img src="//thirdwx.qlogo.cn/mmopen/vi_32/icqWOGDtxDr67QYaKKXhqhnnzw4FSWGDiacezZrJUtRMEqZdDOy2hMY2WK4aLtLOFHuVXO6zv5zOhibDibRus31CXA/46" class="wr_avatar_img">
        </div>
        <span class="name">琴无语</span>
        <span class="action">点评</span>
        <span class="star wr_rankBar wr_rankBar_Default wr_rankBar_10 wr_rankBar_Small"></span>
      </div>
      <p class="content content_Normal">受教。刀子嘴豆腐心并不好，伤人。要好好说话，好好修行，做一个嘴善心良的人。</p>
    </div>
    <div class="reader_topReview_item">
      <div class="title">
        <div class="wr_avatar avatar">
          <img src="//thirdwx.qlogo.cn/mmopen/vi_32/21Ot8kNKZAibC7atdOprialicicQA1O6ribfOsjXjVeHURpibFCm2uRhh7Y1KyaJjaUlMjvflToriax6jxVMmicw9vaovw/46" class="wr_avatar_img">
        </div>
        <span class="name">冬</span>
        <span class="action">点评</span>
        <span class="star wr_rankBar wr_rankBar_Default wr_rankBar_10 wr_rankBar_Small"></span>
      </div>
      <p class="content content_Normal hasMore">用书中最后一段总结：过去种种，譬如昨日死；未来种种，譬如今日生。不要用过去限制了现在，而要以过去为台阶，迈向新的人生。在痛苦的经历中要学会：少一份执着，多一份付出，不要把生命寄托在无常变化的人事物上。</p>
    </div>
    <div class="reader_topReview_item">
      <div class="title">
        <div class="wr_avatar avatar">
          <img src="//wx.qlogo.cn/mmhead/PiajxSqBRaEJ7yX7NrgZcdXeZo9wGul2x7y1NVpAZ571sLpksLtT9PQ/46" class="wr_avatar_img">
        </div>
        <span class="name">千百度</span>
        <span class="action">点评</span>
        <span class="star wr_rankBar wr_rankBar_Default wr_rankBar_10 wr_rankBar_Small"></span>
      </div>
      <p class="content content_Normal hasMore">菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。过去种种，譬如昨日死；未来种种，譬如今日生。不要用过去限制了现在，而要以过去为台阶，迈向新的人生。在痛苦的经历中要学会：少一份执着，多一份付出，不要把生命寄托在无常变化的人事物上。
一念放下心自在，一切随缘。</p>
    </div>
  </div>
  <div class="reader_topReview_footer">
    <a href="/web/bookReview/list?bookId=3c432e505cea493c4be11b7" class="reader_topReview_more">查看更多精彩评论</a>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
// import { ebookMixin } from '@/utils/mixin'
export default {
  // mixins: [ebookMixin],
  props: {
    cover: String,
    title: String,
    author: String,
    desc: String
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/global";
  .reader_topReview_contianer {
    margin-left: px2rem(24);
    margin-right: px2rem(24);
    .reader_topReview_header {
        overflow: hidden;
        margin-bottom: px2rem(10);
        .reader_topReview_title {
            font-size: px2rem(20);
            font-family: "SourceHanSerifCN-Bold",STZhongsong;
            color: #eef0f4;
        }
        .reader_topReview_starControl {
            margin-top: - px2rem(28);
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
    .reader_topReview_content{
      .reader_topReview_item {
          margin-bottom: px2rem(32);
          .title{
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
            .wr_rankBar_Small.wr_rankBar {
                display: inline-block;
                width: 78px;
                height: 14px;
                white-space: nowrap;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 16px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 32px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 48px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_2x.028c4a9b.png) 64px 0 no-repeat;
                background-size: 14px 14px;
            }
            .wr_rankBar_Small.wr_rankBar:after {
                content: "";
                display: inline-block;
                vertical-align: top;
                width: 0;
                height: 14px;
                background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 0 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 16px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 32px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 48px 0 no-repeat,url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/star_small_selected.bc419d99.png) 64px 0 no-repeat;
                background-size: 14px 14px;
            }
          }
      }

    }
    .reader_topReview_footer {
        padding: 0 0 px2rem(40);
        border-radius: 0;
        border: solid hsla(0,0%,100%,.05);
        border-width: 0 0 1px;
    }
  }
  .normal_starItem {
      background: url(https://weread-1253731777.file.myqcloud.com/wrwebnjlogic/image/review_blue_star.93f13e0c.png) no-repeat;
      background-size: 100%;
  }

  .normal_starItem, .selected_starItem, .selected_starItem_Placeholder {
      width: 24px;
      height: 24px;
  }
</style>
