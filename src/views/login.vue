<template>
  <div class="view-login">
    <div class="arc"></div>
    <h1><span>LOADING</span></h1>
  </div>
</template>

<script type="text/ecmascript-6">
import { githubOAuth } from '@/api/mall'
export default {
  name: 'login',
  data () {
    return {
    }
  },
  mounted () {
    githubOAuth(this.$route.query.code).then(res => {
      if (res.data.success === 1) {
        console.log(res.data)
        let guest = {
          userName: res.data.userName,
          avatar: res.data.avatar
        }
        window.localStorage.setItem('GITHUB_LOGIN_TOKEN', res.data.token)
        window.localStorage.setItem('GITHUB_LOGIN_GUEST', JSON.stringify(guest))
        window.localStorage.setItem('GITHUB_LOGIN_MESSAGE', res.data.message)
        // let redirectUrl = window.localStorage.getItem('GITHUB_LOGIN_REDIRECT_URL')
        let redirectUrl = `/profile?profile=new`
        this.$router.push({ path: redirectUrl })
      } else {
        let redirectUrl = window.localStorage.getItem('GITHUB_LOGIN_REDIRECT_URL')
        this.$router.push({ path: redirectUrl })
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/styles/global";
  .arc {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border-top: 2px solid #ffea29;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  animation: rt 2s infinite linear;
}
.arc::before {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border-top: 2px solid #8d29ff;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  animation: rt 4s infinite linear reverse;
  content: "";
}
.arc::after {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  border-radius: 50%;
  border-top: initial;
  border-left: initial;
  border-right: initial;
  animation: cw 1s infinite;
  content: "";
  background: snow;
}

h1 {
  position: absolute;
  height: 40px;
  margin: auto;
  top: 200px;
  left: 0;
  right: 0;
  bottom: 0;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.1em;
  font-size: 14px;
  font-weight: lighter;
  color: white;
}
h1 span {
  display: none;
}
h1::after {
  animation: txt 5s infinite;
  content: "";
}

@keyframes rt {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes cw {
  0% {
    width: 0;
    height: 0;
  }
  75% {
    width: 40px;
    height: 40px;
  }
  100% {
    width: 0;
    height: 0;
  }
}
@keyframes txt {
  0% {
    content: "LOADING.";
  }
  50% {
    content: "LOADING..";
  }
  100% {
    content: "LOADING...";
  }
}
</style>
