<template>
  <tab-bar>
    <tab-bar-item path="/discovery">
      <div slot="item-icon" class="tabbar-icon icon-discovery rem-icon"></div>
      <div slot="item-icon-active" class="icon-discovery tabbar-icon-active rem-icon"></div>
   <div slot="item-text" class="rem-text">发现</div>
    </tab-bar-item>
    <tab-bar-item path="/book">
      <div slot="item-icon" class="tabbar-icon icon-book3 rem-icon"></div>
      <div slot="item-icon-active" class="icon-book3 tabbar-icon-active rem-icon"></div>
      <div slot="item-text" class="rem-text">书架</div>
    </tab-bar-item>
    <tab-bar-item path="/story">
      <div slot="item-icon" class="tabbar-icon icon-story rem-icon"></div>
      <div slot="item-icon-active" class="icon-story tabbar-icon-active rem-icon"></div>
      <div slot="item-text" class="rem-text">故事</div>
    </tab-bar-item>
    <tab-bar-item path="/profile">
      <div slot="item-icon" class="tabbar-icon icon-profile rem-icon"></div>
      <div slot="item-icon-active" class="icon-profile tabbar-icon-active rem-icon"></div>
      <div slot="item-text" class="rem-text">我</div>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
import TabBar from './TabBar'
import TabBarItem from './TabBarItem'

export default {
  name: 'MainTarbar',
  components: {
    TabBar,
    TabBarItem
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/global.scss';

.rem-text {
 font-size: px2rem(12);
 margin: px2rem(3) auto;
}

.rem-icon {
  width:px2rem(20);
  height:px2rem(20);
  font-size: px2rem(20);
  margin: px2rem(4) auto;
}
</style>
