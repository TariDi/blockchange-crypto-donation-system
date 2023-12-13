<template>
  <template v-if="loadingActiveCases || store.pastCasesLoading">
  </template>
  <template v-else>
    <div class="charity-search-bar">
      <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="searchText" placeholder="Search" @keyup.enter="searchTags"/>
      </span>
      <p-button
        type="submit"
        icon="pi pi-arrow-right"
        @click="searchTags"
        size="small"
      />
  </div>
    <div class="charity-layout" v-if="!loadingSearch">
      <div v-for="(charity, index) in activeCases" :key="index">
        <charity-card :charity="charity" :selected-tag="searchQuery" @confirm-donation="onConfirm" :loading="loadingActiveCases"/>
      </div>
    </div>
</template>
</template>

<script lang="ts">
import { useCryptoStore } from "@/stores/crypto";
import CharityCard from "./CharityCard.vue";
import { Component, Vue } from "vue-facing-decorator";
import Toolbar from 'primevue/toolbar'
import InputText from "primevue/inputtext";
import PButton from "primevue/button";
import AutoComplete from "primevue/autocomplete";
import { ref } from "vue";
import type { loadavg } from "os";

@Component({
  components: {
    CharityCard,
    Toolbar,
    InputText,
    PButton,
    AutoComplete
  },
})
export default class CharityLayout extends Vue {
  numberOfCharities = 20
  loadingActiveCases = true
  searchQuery = ''
  searchText = ''
  loadingSearch = false

  activeCases = []

  store = useCryptoStore()

  async mounted() {
    this.loadingActiveCases = true
    await this.store.loadActiveCases()
    .then((cases) => {
      if (cases && Array.isArray(cases)) {
        this.activeCases = cases.sort((a, b)=> Number(b.currentAmount) - Number(a.currentAmount))
      } else {
        console.error("Invalid data format for active cases");
      }
    })
    .catch((error) => {
      console.error("Failed to load active cases:", error);
    })
    .finally(() => {
      this.loadingActiveCases = false
    })

    // console.log("checking reactive property")
    // console.log(this.activeCases);
  }

  get activeCaseList() {
    if (this.activeCases) {
      return this.activeCases
    } else {
      []
    }
  }

  onConfirm() {
    this.loadingActiveCases = true
    this.store.loadActiveCases()
    .then((cases) => {
      if (cases && Array.isArray(cases)) {
        this.activeCases = cases.sort((a, b)=> Number(b.currentAmount) - Number(a.currentAmount))
      } else {
        console.error("Invalid data format for active cases");
      }
    })
    .catch((error) => {
      console.error("Failed to load active cases:", error);
    })
    .finally(() => {
      this.loadingActiveCases = false
    })
  }

  searchTags() {
    console.log(this.searchText)
    this.loadingSearch = true
    this.searchQuery = this.searchText
    this.loadingSearch = false
    console.log(this.searchQuery)
  }


}
</script>

<style lang="scss" scoped>
.charity-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 48px;
  margin-left: 2vw;
}

.charity-search-bar {
  margin-bottom: 2%;
  display: flex;
  align-items: center;
  justify-items: center;
  align-content: center;
  justify-content: center;
  gap: 10px;
}
</style>
