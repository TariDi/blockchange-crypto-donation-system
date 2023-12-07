<template>
  <div class="donations-layout shadow-3">
    <donation-table />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import DonationTable from "./DonationTable.vue";
import { useCryptoStore } from "@/stores/crypto";

@Component({
  components: {
    DonationTable,
  },
})
export default class CharityLayout extends Vue {
  numberOfDonations = 20;

  store = useCryptoStore()
}
</script>

<style lang="scss" scoped>
.donations-layout {
  margin-left: 8vw;
  width: 80%;
}
</style>
