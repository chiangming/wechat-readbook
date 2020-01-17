<template>
  <div class="book-total-wrapper">
    <detail-title :title="title"
                  :showShelf="true"
                  @back="back"
                  ref="title"></detail-title>
    <scroll class="book-list-scroll-wrapper"
            :top="42"
            @onScroll="onScroll"
            ref="scroll">
        <div class = "total-book-item-wrapper">
          <div class="total-book-item" v-for="(value,key) in list" :key="key" @click="showBookCategory(key)">
            <div class="item-object-wrapper">
              <div class="item-left">
                <div class = "item-category-title">{{getCategoryText(key)}}</div>
                <div class = "item-book-title">1.{{value[0].title}}</div>
                <div class = "item-book-title">2.{{value[1].title}}</div>
                <div class = "item-book-title">3.{{value[2].title}}</div>
              </div>
              <div class="item-right">
                <div class="item-cover-wrapper">
                    <img :src="value[0].cover" alt="书籍封面" class="item-cover-img">
                </div>
              </div>
            </div>
          </div>
        </div>
    </scroll>
  </div>
</template>

<script>
import DetailTitle from '@/components/mall/detail/detailTitle'
import Scroll from '@/components/common/scroll'

import { realPx } from '@/utils/utils'
import { list } from '@/api/mall'

export default {
  components: {
    DetailTitle,
    Scroll
  },
  data () {
    return {
      title: '分类榜单',
      list: null
    }
  },
  methods: {
    showBookCategory (key) {
      this.$router.push({
        path: '/mall/list',
        query: {
          category: key,
          categoryText: this.getCategoryText(key)
        }
      })
    },
    getCategoryText (key) {
      // return `${categoryText(categoryList[key], this)}(${this.list[key].length})`
      return this.$t('category.' + key)
    },
    back () {
      this.$router.go(-1)
    },
    onScroll (offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow()
      } else {
        this.$refs.title.hideShadow()
      }
    },
    getList () {
      list().then(response => {
        this.list = response.data.data
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-total-wrapper {
    width: 100%;
    height: 100%;
    background: white;
    .book-list-scroll-wrapper{
      .total-book-item-wrapper{
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          .total-book-item{
            width: 47%;
            margin-bottom: 20px;
            border-radius: 10px;
            overflow: hidden;
            @media (max-width: 960px) {
              width: 100%;
            }
            .item-object-wrapper{
              width: 100%;
              background: whitesmoke;
              display: flex;
              justify-content: space-between;
              overflow: hidden;
              .item-left{
                height: 138px;
                padding: 20px;
                overflow: hidden;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                flex-wrap: nowrap;
                align-items: flex-start;
                .item-category-title{
                  color:black;
                  font-size: 22px;
                  line-height: 22px;
                }
                .item-book-title{
                  width: 100%;
                  overflow: hidden;
                  color: gray;
                  font-size: 14px;
                  line-height: 16px;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
              }
              .item-right{
                .item-cover-wrapper{
                  width: 96px !important;
                  height: 138px !important;
                  background: gray;
                  .item-cover-img{
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            &:last-child{
              margin-bottom: 0;
            }
          }
      }
    }
  }
</style>
