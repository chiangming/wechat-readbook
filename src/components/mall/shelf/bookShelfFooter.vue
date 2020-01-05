<template>
  <div class="book-shelf-footer">
    <div class="book-shelf-tab-wrapper" v-for="(item, index) in tabs" :key="index" @click="onTabClick(item)">
      <div class="book-shelf-tab">
        <div class="icon-private tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 2 && !isDownload"></div>
        <div class="icon-download-remove tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 2 && isDownload"></div>
        <div class="icon-move tab-icon" :class="{'is-selected': isSelected}" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" :class="{'is-selected': isSelected}" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4, 'is-selected': isSelected}">{{label(item)}}
        </div>
      </div>
    </div>
    <popup ref="popup"
           :title="popTitle"
           :confirmText="confirmText"
           :isRemoveText="isRemoveText"
           :cancelText="$t('shelf.cancel')"
           @confirm="onConfirm"></popup>
    <shelf-group-dialog :visible.sync="ifGroupDialogShow"
                        :data="data"
                        :bookList="bookList"
                        :category="category"
                        :isInGroup="isInGroup"
                        @group="groupEdit"></shelf-group-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import Popup from '@/components/shelf/popup'
  import ShelfGroupDialog from '@/components/shelf/shelfGroupDialog'

  export default {
    props: {
      data: Array,
      isInGroup: Boolean,
      bookList: Array,
      category: Object
    },
    components: {
      ShelfGroupDialog,
      Popup
    },
    computed: {
      selectedBooks() {
        const selectedBooks = []
        this.data.forEach(item => {
          if (item.selected) {
            selectedBooks.push(item)
          }
        })
        return selectedBooks
      },
      isSelected() {
        if (this.data) {
          return this.data.some(item => item.selected)
        } else {
          return false
        }
      },
      isPrivate() {
        if (!this.isSelected) {
          return false
        } else {
          return this.data.every(item => {
            if (item.selected) {
              return item.private
            } else {
              return true
            }
          })
        }
      },
      isDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.data.every(item => {
            if (item.selected) {
              return item.cache
            } else {
              return true
            }
          })
        }
      },
      tabs() {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      }
    },
    data() {
      return {
        popTitle: '',
        confirmText: '',
        isRemoveText: false,
        ifShowPopup: false,
        ifGroupDialogShow: false,
        onConfirm: function() {}
      }
    },
    methods: {
      label(item) {
        switch (item.index) {
          case 1:
            return this.isPrivate ? item.label2 : item.label
          case 2:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      },
      removeBook() {
        this.$emit('removeBook')
      },
      onSetDownload() {
        this.$emit('setDownload', true)
      },
      onRemoveDownload() {
        this.$emit('setDownload', false)
      },
      onSetPrivate() {
        this.$emit('setPrivate', true)
      },
      onCancelPrivate() {
        this.$emit('setPrivate', false)
      },
      onTabClick(item) {
        if (item.index === 1) {
          this.showPrivate()
        } else if (item.index === 2) {
          this.showDownload()
        } else if (item.index === 3) {
          this.showGroupDialog()
        } else if (item.index === 4) {
          this.showRemove()
        }
      },
      showGroupDialog() {
        if (this.isSelected) {
          this.ifGroupDialogShow = true
        }
      },
      showRemove() {
        if (this.isSelected) {
          let msg
          if (this.selectedBooks.length === 1) {
            msg = this.$t('shelf.removeBookTitle').replace('$1', '《' + this.selectedBooks[0].title + '》')
          } else {
            msg = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
          }
          this.showPopup(msg, this.$t('shelf.removeBook'), this.removeBook, true)
        }
      },
      showDownload() {
        if (this.isSelected) {
          if (!this.isDownload) {
            this.showPopup(this.$t('shelf.setDownloadTitle'), this.$t('shelf.open'), this.onSetDownload)
          } else {
            this.showPopup(this.$t('shelf.removeDownloadTitle'), this.$t('shelf.delete'), this.onRemoveDownload, true)
          }
        }
      },
      showPrivate() {
        if (this.isSelected) {
          if (!this.isPrivate) {
            this.showPopup(this.$t('shelf.setPrivateTitle'), this.$t('shelf.open'), this.onSetPrivate)
          } else {
            this.showPopup(this.$t('shelf.closePrivateTitle'), this.$t('shelf.close'), this.onCancelPrivate)
          }
        }
      },
      showPopup(title, confirmText, onConfirm, isRemoveText = false) {
        this.popTitle = title
        this.confirmText = confirmText
        this.onConfirm = onConfirm
        this.isRemoveText = isRemoveText
        this.$refs.popup.show()
      },
      groupEdit(operation, group) {
        this.$emit('groupEdit', operation, group)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .book-shelf-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .book-shelf-tab {
        width: 100%;
        height: 100%;
        @include columnCenter;
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
          opacity: .5;
          &.icon-shelf {
            color: $color-pink;
          }
          &.icon-download {
            font-size: px2rem(22);
          }
          &.is-selected {
            opacity: 1;
          }
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          opacity: .5;
          &.remove-text {
            color: $color-pink;
          }
          &.is-selected {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
