<!--<template>-->
<!--<div class="story">-->
<!--  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
<!--    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">-->
<!--      <van-cell v-for="item in list" :key="item" :title="item"/>-->
<!--    </van-list>-->
<!--  </van-pull-refresh>-->

<!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import Vue from 'vue'-->
<!--import { Cell, CellGroup, List, PullRefresh } from 'vant'-->

<!--Vue.use(Cell)-->
<!--  .use(CellGroup)-->
<!--  .use(List)-->
<!--  .use(PullRefresh)-->

<!--export default {-->
<!--  name: 'Story',-->
<!--  data () {-->
<!--    return {-->
<!--      list: [],-->
<!--      loading: false,-->
<!--      finished: false,-->
<!--      isLoading: false-->
<!--    }-->
<!--  },-->

<!--  methods: {-->
<!--    onRefresh () {-->
<!--      setTimeout(() => {-->
<!--        console.log('shuaxing')-->
<!--        this.isLoading = false-->
<!--        this.list = []-->
<!--        for (let i = 0; i < 20; i++) {-->
<!--          this.list.push(this.list.length + 1)-->
<!--        }-->
<!--      }, 500)-->
<!--    },-->
<!--    onLoad () {-->
<!--      // 异步更新数据-->
<!--      setTimeout(() => {-->
<!--        for (let i = 0; i < 10; i++) {-->
<!--          this.list.push(this.list.length + 1)-->
<!--        }-->
<!--        // 加载状态结束-->
<!--        this.loading = false-->

<!--        // 数据全部加载完成-->
<!--        if (this.list.length >= 140) {-->
<!--          this.finished = true-->
<!--        }-->
<!--      }, 500)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.story {-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  overflow: scroll;-->
<!--  background: #17abe3;-->
<!--}-->
<!--</style>-->
