<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import PToolbar from 'primevue/toolbar'
import Button from 'primevue/button'
</script>

<template>
  <div class="main-page" style="">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>

.main-page {
  display:contents;
}

</style>
