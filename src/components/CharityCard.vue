<template>
  <div class="wrapper">
    <p-card style="width: 25em">
      <template #header>
        <img alt="user header" src="@/assets/best-fundraising-websites.png" width="400" />
      </template>
      <template #title> DetailsHash - {{ charity.detailsHash }} </template>
      <template #subtitle> Target Amount - {{ charity.targetAmount }} </template>
      <template #content>
        <p class="m-0">
          ImageHash - {{ charity.imageHash }}
        </p>
      </template>
      <template #footer>
        <p-button icon="pi pi-money-bill" label="Donate" @click="visible = true" />
        <p-button icon="pi pi-bookmark" label="Bookmark" severity="secondary" style="margin-left: 0.5em" />
      </template>
    </p-card>
    <Dialog v-model:visible="visible" modal :header="'Make Donation -> ' + charity.detailsHash"
      :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="flex gap-3">
        <InputGroup>
          <InputNumber v-model="donationAmount" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" />
          <InputGroupAddon>ETH</InputGroupAddon>
        </InputGroup>
        <p-button icon="pi pi-check" label="Confirm" @click="onConfirm" />
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
import { Component, Prop, Vue } from "vue-facing-decorator";
import { useCryptoStore } from "@/stores/crypto";

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
  @Prop() charity!: any; // Define the charity prop
  visible = false;
  donationAmount = 0;
  store = useCryptoStore();

  async onConfirm() {
    const donationData = {
      amount: this.donationAmount,
      caseId: this.charity.id
    };

    // console.log(this.uploadedImage)
    console.log("donation data!!")
    console.log(donationData)

    await this.store.donateToCase("0x9de91b283b503Fa2dda8B184Ad062A6050fFd156", donationData.amount, donationData.caseId);
  }

}
</script>

<style lang="scss" scoped>
.wrapper {
  display: contents;
}
</style>
