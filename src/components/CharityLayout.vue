<template>
  <template v-if="loadingActiveCases">
  </template>
  <template v-else>
  <div class="charity-layout">
    <div v-for="(charity, index) in activeCases" :key="index">
      <charity-card :charity="charity" @confirm-donation="onConfirm"/>
    </div>
  </div>
</template>
</template>

<script lang="ts">
import { useCryptoStore } from "@/stores/crypto";
import CharityCard from "./CharityCard.vue";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {
    CharityCard,
  },
})
export default class CharityLayout extends Vue {
  numberOfCharities = 20
  loadingActiveCases = false

  activeCases = []

  store = useCryptoStore()

  mounted() {
    this.loadingActiveCases = true
    this.store.loadActiveCases()
    .then((cases) => {
      // console.log("Loaded active cases:", cases)
      if (cases && Array.isArray(cases)) {
        this.activeCases = cases;
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
      // console.log("Loaded active cases:", cases)
      if (cases && Array.isArray(cases)) {
        this.activeCases = cases;
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

}
</script>

<style lang="scss" scoped>
.charity-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 48px;
}
</style>
