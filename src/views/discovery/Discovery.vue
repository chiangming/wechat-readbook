<template>
<div>
<h3 class="tilte">{{$store.state.message}}</h3>
<h3 class="tilte">{{$store.getters.showMessage("啦啦啦拉拉")}}</h3>
<button @click="btnClick(5)">{{btn}}</button>
</div>
</template>

<script>

export default {
  name: 'Discovery',
  data () {
    return {
      message: 'Discovery',
      btn: '按钮'
    }
  },
  methods: {
    btnClick (num) {

    }
  }
}
</script>

<style scoped>
.title {
  color: cadetblue;
}
</style>
