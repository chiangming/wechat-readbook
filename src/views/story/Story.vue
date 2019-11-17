<template>
<div>
<h3 class="tilte">{{message}}</h3>
<button @click="btnClick">{{btn}}</button>
</div>
</template>

<script>
export default {
  name: 'Story',
  data () {
    return {
      message: 'story',
      btn: '按钮'
    }
  },
  methods: {
    btnClick () {
      console.log('btn click~')
    }
  }
}
</script>

<style scoped>
.title {
  color: cadetblue;
}
</style>
