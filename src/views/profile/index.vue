<template>
  <div class="view-profile">
    <div class="profile-header-wrapper" ref="title">
      <span class="icon-mail"></span>
      <span class="icon-setting"></span>
    </div>
    <scroll class="profile-content-wrapper"
            :top="42"
            :bottom="52"
            @onScroll="onScroll"
            ref="scroll">
      <div class="profile-content-header">
        <div class="profile-user-img">
          <img class="user-img" src="@/assets/images/user.png">
        </div>
        <div class="profile-user-name">游客</div>
        <div class="profile-logging-text" @click="githubLogin()">点击登录<span class="icon-forward"></span></div>
      </div>
      <div class="profile-content-item-wrapper">
        <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-account" src="@/assets/images/icon-account.png">
            <span class="profile-text">账户</span>
          </div>
          <div class="item-right">
            <div class="item-number item-account-number">0.00</div>
            <div class="item-subline">已购0本书</div>
          </div>
        </div>
       <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-card" src="@/assets/images/icon-card.png">
            <span class="profile-text">无限卡</span>
          </div>
          <div class="item-right">
            <div class="item-text">免费领取<span class="item-number">20</span>天</div>
          </div>
        </div>
      </div>
      <div class="profile-content-item-wrapper">
        <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-rank" src="@/assets/images/icon-rank.png">
            <span class="profile-text">读书排行榜</span>
          </div>
          <div class="item-right">
            <div class="item-text">第<span class="item-number">1</span>名</div>
            <div class="item-subline">1分钟</div>
          </div>
        </div>
      </div>
      <div class="profile-content-item-wrapper">
        <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-watch" src="@/assets/images/icon-watch.png">
            <span class="profile-text">关注</span>
          </div>
          <div class="item-right">
            <div class="item-text"><span class="item-number">0</span>人关注我</div>
          </div>
        </div>
        <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-crown" src="@/assets/images/icon-crown.png">
            <span class="profile-text">每日一答</span>
          </div>
          <div class="item-right">
            <div class="item-text">挑战<span class="item-number">12</span>道题</div>
          </div>
        </div>
      </div>
      <div class="profile-content-item-wrapper">
        <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-note" src="@/assets/images/icon-note.png">
            <span class="profile-text">笔记、读过和赞过</span>
          </div>
          <div class="item-right">
          </div>
        </div>
        <div class="profile-content-item">
          <div class="item-left">
            <img class="profile-icon-img icon-booklist" src="@/assets/images/icon-bookList.png">
            <span class="profile-text">书单</span>
          </div>
        </div>
      </div>

    </scroll>
    <div class="profile-footer-wrapper">
      <common-footer :selectIndex="4"></common-footer>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/components/common/scroll'
import commonFooter from '../../components/common/footer'
import { realPx } from '@/utils/utils'

const clientId = '8947582dbbed86c4d51f'
const redirectUri = 'http://192.168.0.103:8081/login'
const githubScope = 'read:user'

export default {
  name: 'profile',
  components: {
    Scroll,
    commonFooter
  },
  data () {
    return {
    }
  },
  methods: {
    onScroll (offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.style.boxShadow = '0 2px 2px 0 rgba(0, 0, 0, .1)'
      } else {
        this.$refs.title.style.boxShadow = 'none'
      }
    },
    githubLogin: function () {
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${githubScope}`
      window.localStorage.setItem('GITHUB_LOGIN_REDIRECT_URL', `${this.$route.path}?profile=new`)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
@import '../../assets/fonts/STKaiti.css';

.view-profile{
    position: relative;
    width: 100%;
    height: 100%;
    background: #f2f6fc;
    .profile-header-wrapper{
      position: absolute;
      top: 0;
      height: px2rem(42);
      padding:px2rem(5) px2rem(18);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width:100%;
      color:#626262;
      background: white;
      .icon-mail{
        line-height: px2rem(28);
        font-size: px2rem(24);
      }
      .icon-setting{
        line-height: px2rem(28);
        font-size: px2rem(24);
      }
    }
    .profile-content-wrapper{
      width:100%;
      .profile-content-header{
        background: white;
        min-height: px2rem(200);
        margin-bottom: px2rem(8);
        .profile-user-img{
          width:100%;
          text-align: center;
          .user-img{
            height: px2rem(80);
            width:px2rem(80);
            border-radius: px2rem(40);
            background: #f2f6fc;
            margin-bottom: px2rem(10);
            margin-top: px2rem(20);
          }
        }
        .profile-user-name{
          width: 100%;
          text-align: center;
          color:black;
          font-size: px2rem(21);
          font-family: STZhongsong;
          margin-top: px2rem(10);
        }
        .profile-logging-text{
          width: 100%;
          text-align: center;
          color:#c7ccd4;
          font-size: 12px;
          margin-top:px2rem(15);
        }
      }
      .profile-content-item-wrapper{
        background: white;
        margin-bottom: px2rem(8);
        .profile-content-item{
          width:100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: px2rem(18);
          line-height: px2rem(24);
          padding: px2rem(20) 0;
          .item-left{
            margin-left: 18px;
            .profile-icon-img{
              display: inline-block;
              vertical-align:middle;
              height:px2rem(24);
              width: px2rem(24);
              border-radius: px2rem(12);
              }
            .icon-account{
              background-image: linear-gradient(to right bottom, #F44336 0%, #fba989 100%)
            }
            .icon-booklist{
              background:linear-gradient(to right bottom, #c948df, #f0bdf9);
            }
            .icon-card{
              background:linear-gradient(to right bottom, #FF9800, #ffcc80);
            }
            .icon-crown{
              background:linear-gradient(to right bottom, #2196F3, #9fd4ff);
            }
            .icon-note{
              background:linear-gradient(to right bottom, #3F51B5, #bfc2d2);
            }
            .icon-rank{
              background:linear-gradient(to right bottom, #ffe500, #f5f1ce);
            }
            .icon-watch{
              background:linear-gradient(to right bottom,#74F195,#C8FF9A);
            }
            .profile-text{
              line-height: px2rem(24);
              font-size: px2rem(16);
              vertical-align: middle;
              margin-left: px2rem(18);
              // font-family: 'STKaiti';
            }
          }
          .item-right{
            font-size: px2rem(18);
            margin-right: 18px;
            text-align: right;
            .item-number{
              font-size:px2rem(20);
              vertical-align: - px2rem(1);
              margin: 0 px2rem(5);
              color:black;
            }
            .item-text{
              font-size:px2rem(12);
              color:#4a4a4a;
            }
            .item-subline{
              font-size:px2rem(12);
              color: gray;
            }
            .item-account-number{
              margin-right: 0!important;
            }
          }
        }
      }
    }
    .profile-footer-wrapper{
      position: absolute;
      bottom: 0;
      height: px2rem(42);
    }
  }
</style>
