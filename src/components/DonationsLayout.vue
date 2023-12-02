<template>
  <div class="donations-layout shadow-3">
    <donation-table />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import DonationTable from "./DonationTable.vue";

@Component({
  components: {
    DonationTable,
  },
})
export default class CharityLayout extends Vue {
  numberOfDonations = 20;
}
</script>

<style lang="scss" scoped>
.donations-layout {
  justify-content: center;
  width: 95%;
}
</style>
