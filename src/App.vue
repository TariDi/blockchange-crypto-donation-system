<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";

</script>

<template>
  <div class="main-page" style="">
    <Toast/>
    <ConfirmPopup></ConfirmPopup>
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  display: contents;
}
</style>
