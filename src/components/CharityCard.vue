<template>
  <div class="wrapper">
    <p-card style="width: 25em">
      <template #header>
        <img
          alt="user header"
          src="@/assets/best-fundraising-websites.png"
          width="400"
        />
      </template>
      <template #title> Case Name </template>
      <template #subtitle> Education </template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis
          esse, cupiditate neque quas!
        </p>
      </template>
      <template #footer>
        <p-button
          icon="pi pi-money-bill"
          label="Donate"
          @click="visible = true"
        />
        <p-button
          icon="pi pi-bookmark"
          label="Bookmark"
          severity="secondary"
          style="margin-left: 0.5em"
        />
      </template>
    </p-card>
    <Dialog
      v-model:visible="visible"
      modal
      header="Make Donation -> Charity Name"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="flex gap-3">
        <InputGroup>
          <InputNumber
            v-model="donationAmount"
            inputId="minmaxfraction"
            :minFractionDigits="2"
            :maxFractionDigits="5"
          />
          <InputGroupAddon>ETH</InputGroupAddon>
        </InputGroup>
        <p-button icon="pi pi-check" label="Confirm" @click="visible = false" />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import PCard from "primevue/card";
import PButton from "primevue/button";
import Dialog from "primevue/dialog";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import { Component, Vue } from "vue-facing-decorator";

@Component({
  components: {
    PCard,
    PButton,
    Dialog,
    InputGroup,
    InputGroupAddon,
    InputNumber,
  },
})
export default class CharityCard extends Vue {
  visible = false;
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: contents;
}
</style>
