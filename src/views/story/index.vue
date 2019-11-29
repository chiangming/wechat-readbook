<template>
  <div class="index">
    <my-scroll  ref="myScroll" :page="page" :on-refresh="onRefresh" :on-pull="onPull"  :get-scroll-top="getTop" :scroll-state="scrollState">
      <div slot="scrollList">
        <ul>
          <li v-for="(x,index) in list" :key="index">
            <h3>列表 {{index}}</h3>
          </li>
        </ul>
      </div>
    </my-scroll>
  </div>
</template>
<script type="text/javascript">
import myScroll from '../../components/scroll/Scroll.vue'
export default {
  data () {
    return {
      scrollState: true, // 是否可以滑动
      indexScrollTop: 0,
      list: [],
      page: {
        counter: 1,
        pageStart: 1,
        pageEnd: 1,
        total: 10
      }
    }
  },
  methods: {
    onRefresh (mun) { // 刷新回调
      setTimeout(() => {
        this.$refs.myScroll.setState(3)
      }, 500)
    },
    onPull (mun) { // 加载回调
      if (this.page.counter <= this.page.total) {
        setTimeout(() => {
          this.page.counter++
          this.$refs.myScroll.setState(5)
          for (let i = 0; i < 10; i++) {
            this.list.push({ 'index': i })
          }
        }, 500)
      } else {
        this.$refs.myScroll.setState(7)
      }
    },
    getTop (y) { // 滚动条位置

    }

  },
  components: {
    myScroll
  },
  created () {

  },
  mounted () {
    for (let i = 0; i < 1 * 50; i++) {
      this.list.push({})
    }
  }

}
</script>
<style lang="scss" scoped>
  .index{
  width: 100%;
    height: 100%;
    overflow: scroll;
  }
</style>
