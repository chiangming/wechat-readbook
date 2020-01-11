<template>
  <div class="content-slide-wrapper">
      <!-- swiper -->
      <swiper :options="swiperOption">
        <swiper-slide v-for="n in 10" :key="n">Slide {{n}}</swiper-slide>
        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      </swiper>
    </div>
</template>

<script>
import '@/assets/styles/swipe.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  }
}
</script>

<style scoped>
.content-slide-wrapper{
  min-height: 200px;
}
  .swiper-slide {
    width: 80%;
    min-height: 200px;
    background: wheat;
  }
</style>
