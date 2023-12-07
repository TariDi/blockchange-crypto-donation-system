<template>
  <div class="main-page">
    <template v-if="store.refreshLoading">
    </template>
    <template v-else>
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
      <div class="space-left">
        <navigation />
      </div>
      <main>
        <div class="working-area">
          <router-view />
        </div>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import CharityLayout from "../components/CharityLayout.vue";
import PToolbar from "primevue/toolbar";
import Navigation from "../components/Navigation.vue";
import { RouterView } from "vue-router";
import { onMounted } from 'vue'
import { useCryptoStore } from "@/stores/crypto";
import { ref } from "vue";

const store = ref(useCryptoStore())

onMounted(async () => {
  if(!store.value.web3 || !store.value.charityContract) {
    await store.value.initialize()
  }
})
</script>

<style lang="scss" scoped>
.header {
  grid-column: 1/6;
  grid-row: 1/2;
  position: sticky;
  position: -webkit-sticky;
  z-index: 1000;
  top: 0;
}

main {
  grid-column: 2/4;
  grid-row: 2/6;
  display: flex;
  justify-content: center;
  justify-items: center;
  align-content: start;
  align-items: start;
}

.working-area {
  padding-top: 36px;
  padding-left: 36px;
}

:deep(.space-left) {
  grid-column: 1/2;
  grid-row: 2/-1;
  position: sticky;
  position: -webkit-sticky;
  z-index: 900;
  top: 90px;
  height: 91vh;
}
</style>
