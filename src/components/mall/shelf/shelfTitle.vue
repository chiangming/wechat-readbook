<template>
  <transition name="fade">
    <div class="shelf-title-wrapper" :class="{'hide-shadow': ifHideShadow}">
      <div class="title">
        <span class="title-text">{{title}}</span>
        <span class="sub-title-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="btn-text-wrapper" @click="onEditClick" v-if="!ifGroupEmpty && !isDataEmpty">
        <span class="btn-text">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
      <div class="btn-text-wrapper" @click="changeGroup" v-if="ifGroupEmpty && !isDataEmpty">
        <span class="btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
      <div class="btn-text-wrapper" @click="changeLanguage" v-if="isDataEmpty">
        <span class="btn-text">{{$t('shelf.changeLanguage')}}</span>
      </div>
      <div class="btn-clear-wrapper" @click="clearCache" v-if="ifShowClear && !isDataEmpty">
        <span class="btn-clear">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="btn-back-wrapper" @click="back" v-if="ifShowBack && !isEditMode">
        <span class="icon-back"></span>
      </div>
      <div class="btn-back-wrapper" @click="changeGroup" v-if="ifShowBack && isEditMode">
        <span class="btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
      <popup ref="popup"
             :title="popupTitle"
             :thirdText="thirdText"
             :confirmText="confirmText"
             :isRemoveText="true"
             :cancelText="$t('shelf.cancel')"
             @confirm="onPopupDelete"
             @third="onPopupChange"></popup>
      <shelf-group-dialog :visible.sync="ifGroupDialogShow"
                          :isEditGroupName="true"
                          :category="category"
                          @editGroupName="editGroupName"
                          ref="groupDialog"></shelf-group-dialog>
    </div>
  </transition>
</template>

<script>
  import Popup from '@/components/shelf/popup'
  import ShelfGroupDialog from '@/components/shelf/shelfGroupDialog'
  import { switchLocale } from '@/utils/book'

  export default {
    components: {
      ShelfGroupDialog,
      Popup
    },
    props: {
      isEditMode: Boolean,
      ifShowBack: Boolean,
      ifShowClear: Boolean,
      ifGroupEmpty: Boolean,
      data: Array,
      title: String,
      category: Object
    },
    computed: {
      isDataEmpty() {
        return !this.data || this.data.filter(item => item.type !== 3).length === 0
      },
      selectedText() {
        return this.selectedNumber === 0 ? this.$t('shelf.selectBook') : (this.selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', this.selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', this.selectedNumber))
      },
      selectedNumber() {
        if (this.category && this.category.itemList) {
          return this.category.itemList.filter(item => item.selected).length
        } else if (this.data) {
          return this.data.filter(item => item.selected).length
        } else {
          return 0
        }
      },
      thirdText() {
        if (this.isDeleteGroup) {
          return ''
        } else {
          return this.$t('shelf.editGroupName')
        }
      },
      popupTitle() {
        if (this.isDeleteGroup) {
          return this.$t('shelf.deleteGroupTitle')
        } else {
          return ''
        }
      },
      confirmText() {
        if (this.isDeleteGroup) {
          return this.$t('shelf.confirm')
        } else {
          return this.$t('shelf.deleteGroup')
        }
      }
    },
    data() {
      return {
        ifHideShadow: true,
        ifGroupDialogShow: false,
        isDeleteGroup: false
      }
    },
    methods: {
      changeLanguage() {
        switchLocale(this)
      },
      editGroupName(category, groupName) {
        this.$emit('editGroupName', category, groupName)
      },
      showPopup() {
        this.$refs.popup.show()
      },
      onPopupDelete() {
        if (this.isDeleteGroup) {
          this.$emit('deleteGroup', this.category)
          this.isDeleteGroup = false
        } else {
          this.$refs.popup.hide()
          setTimeout(() => {
            this.isDeleteGroup = true
            this.$refs.popup.show()
          }, 200)
        }
      },
      onPopupChange() {
        this.ifGroupDialogShow = true
        this.$refs.groupDialog.showEditGroupDialog()
      },
      changeGroup() {
        this.showPopup()
      },
      back() {
        this.$router.go(-1)
      },
      clearCache() {
        this.$emit('clearCache')
      },
      showShadow() {
        this.ifHideShadow = false
      },
      hideShadow() {
        this.ifHideShadow = true
      },
      onEditClick() {
        if (this.isEditMode) {
          this.$emit('onEditClick', false)
        } else {
          this.$emit('onEditClick', true)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title-wrapper {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    .title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 110;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .sub-title-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .btn-text-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 115;
      padding-right: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;
      .btn-text {
        font-size: px2rem(14);
        color: #666;
      }
    }
    .btn-clear-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 115;
      padding-left: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;
      .btn-clear {
        font-size: px2rem(14);
        color: #666;
      }
    }
    .btn-back-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 115;
      padding-left: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      font-size: px2rem(20);
      color: #666;
      @include center;
      &:active {
        color: rgba(102, 102, 102, .5);
      }
      .btn-text {
        font-size: px2rem(14);
        color: #666;
      }
    }
  }
</style>
