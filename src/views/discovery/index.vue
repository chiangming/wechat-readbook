<template>
  <div class="view-profile">
    <common-search :ifShowSearchPage.sync="ifShowSearchPage"
                  :ifShowHotSearch.sync="ifShowHotSearch"
                  :isDataEmpty="false"
                   ref="searchBar">
                   <template v-slot:button="slotProps">
                      <div class="btn-edit-wrapper" @click="toMall" v-if="slotProps.ifShow">
                        <span class="btn-edit-text">书城</span>
                      </div>
                    </template>
                   </common-search>
    <div class="content-wrapper">
      <swiper :options="swiperOption">
            <swiper-slide>
            </swiper-slide>
            <swiper-slide>1</swiper-slide>
            <swiper-slide>1</swiper-slide>
      </swiper>
    </div>
    <div class="footer-wrapper">
      <common-footer :selectIndex="1"></common-footer>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CommonSearch from '@/components/common/search'
import CommonFooter from '../../components/common/footer'
export default {
  name: 'profile',
  components: {
    CommonSearch,
    CommonFooter,
    swiper,
    swiperSlide
  },
  data () {
    return {
      ifShowSearchPage: false,
      ifShowHotSearch: false
    }
  },
  methods: {
    toMall () {
      this.$router.push({
        path: '/mall/home'
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .view-profile{
    position: relative;
    width: 100%;
    height: 100%;
    .footer-wrapper{
      position: absolute;
      bottom: 0;
      height: px2rem(42);
    }
  }
</style>
