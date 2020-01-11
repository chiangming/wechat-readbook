<template>
  <div class="view-login">
    Login
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
    }
  },
  mounted () {
    return axios.get(`/oauth/github/github_oauth?code=${this.$route.query.code}`).then(res => {
      if (res.data.success === 1) {
        let guest = {
          userName: res.data.userName,
          avatar: res.data.avatar
        }
        window.localStorage.setItem('GITHUB_LOGIN_TOKEN', res.data.token)
        window.localStorage.setItem('GITHUB_LOGIN_GUEST', JSON.stringify(guest))
        let redirectUrl = window.localStorage.getItem('GITHUB_LOGIN_REDIRECT_URL')
        this.$router.push({ path: redirectUrl })
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/styles/global";
</style>
