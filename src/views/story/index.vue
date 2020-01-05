<template>
  <div class="view-profile">
    <div v-for="(items, index) in list" :key="index">
      <span>-- 类别：{{index}}</span>
      <div v-for="(item, i) in items" :key="i">
        <span>INSERT INTO `book` VALUES (NULL, '{{item.fileName}}', '{{item.cover}}', '{{item.title}}', '{{item.author}}', '{{item.publisher}}', '{{item.bookId}}', '{{item.category}}', '{{item.categoryText}}', '{{item.language}}', '/OEBPS/package.opf');</span>
      </div>
    </div>
    <div class="footer-wrapper">
      <!-- <common-footer :selectIndex="3"></common-footer> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import commonFooter from '../../components/common/footer'
import { categoryList } from '@/api/mall.js'
export default {
  name: 'profile',
  components: {
    // commonFooter
  },
  data () {
    return {
      list: Object
    }
  },
  methods: {
    getList () {
      categoryList().then(response => {
        this.list = response.data.data
        console.log(this.list)
      })
      console.log('!!!!!!!!!!!!!!!!')
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .view-profile{
    position: relative;
    width: 100%;
    height: 100%;
    overflow:scroll;
    .footer-wrapper{
      position: absolute;
      bottom: 0;
      height: px2rem(42);
    }
  }
</style>
