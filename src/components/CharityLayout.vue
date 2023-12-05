<template>
  <div class="charity-layout">
    <div v-for="(charity, index) in activeCases" :key="index">
      <charity-card :charity="charity" />
    </div>
  </div>
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
  numberOfCharities = 20;

  activeCases = []

  store = useCryptoStore()

  async mounted() {
    try {
      const cases = await this.store.loadActiveCases();
      console.log("Loaded active cases:", cases);
      if (cases && Array.isArray(cases)) {
        this.activeCases = cases;
      } else {
        console.error("Invalid data format for active cases");
      }
    } catch (error) {
      console.error("Failed to load active cases:", error);
    }

    console.log("checking reactive property")
    console.log(this.activeCases);
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
