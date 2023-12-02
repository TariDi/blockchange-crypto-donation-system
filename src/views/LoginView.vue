<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import PToolbar from "primevue/toolbar";
import Button from "primevue/button";
import LoginCard from "../components/LoginCard.vue";
</script>

<template>
  <div class="main-page">
    <div class="header">
      <p-toolbar class="bg-teal-500 shadow-4 border-none">
        <template #start>
          <div
            class="text-4xl font-bold text-primary-50"
            style="{margin-left: 100px;}"
          >
            BlockChange
          </div>
        </template>

        <template #center> </template>
      </p-toolbar>
    </div>
    <main>
      <login-card />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.header {
  grid-column: 1/3;
  grid-row: 1/2;
  margin-bottom: 50px;
  padding-bottom: 50px;
  position: sticky;
  position: -webkit-sticky;
  z-index: 10000;
  top: 0;
}

main {
  grid-column: 2/3;
  grid-row: 2/-1;
  display: flex;
}
</style>
