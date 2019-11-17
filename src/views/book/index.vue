<template>
<div class="ebook">
  <ebook-title></ebook-title>
  <ebook-reader>
    <div id = "read"></div>
  </ebook-reader>
  <ebook-menu></ebook-menu>
</div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'

export default {
  name: 'book',
  mounted () {

  },
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  }
}
</script>

<style scoped>

</style>
