<template>
  <template v-if="loadingbeneficiaryCases">
  </template>
  <template v-else>
  <div class="donations-layout">
    <div v-for="(charity, index) in beneficiaryCases" :key="index">
      <donation-card :charity="charity" />
    </div>
  </div>
</template>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import DonationCard from "./DonationCard.vue";
import { useCryptoStore } from "@/stores/crypto";

@Component({
  components: {
    DonationCard,
  },
})
export default class DonationsLayout extends Vue {
  numberOfDonations = 20;

  loadingbeneficiaryCases = false

  beneficiaryCases = []
  store = useCryptoStore()

  mounted() {
    this.loadingbeneficiaryCases = true
    this.store.getBeneficiaryCaseDetails(this.store.currentSession.accountId)
    .then((cases) => {
      console.log("Loaded beneficiary cases:", cases)
      if (cases && Array.isArray(cases)) {
        this.beneficiaryCases = cases;
      } else {
        console.error("Invalid data format for active cases");
      }
    })
    .catch((error) => {
      console.error("Failed to load beneficiary cases:", error);
    })
    .finally(() => {
      this.loadingbeneficiaryCases = false
    })

  }

  get activeCaseList() {
    if (this.beneficiaryCases) {
      return this.beneficiaryCases
    } else {
      []
    }
  }

}
</script>

<style lang="scss" scoped>
.donations-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 48px;
}
</style>
