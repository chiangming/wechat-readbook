<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot  name="item-icon"></slot></div>
    <div v-else> <slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: '#17abe3'
    }
  },
  data () {
    return {
      // isActive: true
    }
  },
  computed: {
    isActive () {
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle () {
      return this.isActive ? { color: this.activeColor } : {}
    }
  },
  methods: {
    itemClick () {
      console.log('item Click')
      if (this.$route.path !== this.path) {
        this.$router.replace(this.path)
      }
    }
  }
}
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  min-height: 49px;
  color: #8a8a8a;
}

.tabbar-icon {
  font-size: 24px;
  color: #8a8a8a;
}

.tabbar-icon-active {
  font-size: 24px;
  color:#17abe3;
}

</style>
