<template>
  <div class="wrapper">
    <template v-if="store.pinataDetailsLoading">
      <p-card style="width: 25em height: 30em">
        <template #header>
          <Skeleton width="27em" height="10em"></Skeleton>
      </template>
      <template #title>
        <Skeleton width="24em" height="2em"></Skeleton>
      </template>
      <template #content>
        <Skeleton width="24em" height="15em"></Skeleton>
      </template>
      </p-card>
    </template>
    <template v-else>
      <p-card style="width: 25em">
        <template #header>
          <img alt="user header" :src="imageLink" width="400" />
        </template>
        <template #title >{{ details.title }}</template>
        <template #subtitle >
          Created by - {{ details.createdBy }}
        </template>
        <template #content v-if="caseDetails !== undefined">
          <div class="mb-4">
            {{ details.description }}
          </div>
          <div class="mb-4">
            <ProgressBar :value="calcPercent(convertWeiToEther(charity.currentAmount), convertWeiToEther(charity.targetAmount))"> {{ convertWeiToEther(charity.currentAmount) }} </ProgressBar>
            <div class="p-1 flex flex-row justify-content-between">
              <span class="text-xs font-normal"> Raised: {{ convertWeiToEther(charity.currentAmount) }} </span>
              <span class="text-xs font-bold"> Target: {{ convertWeiToEther(charity.targetAmount) }} </span>
            </div>
          </div>
        </template>
        <template #footer>
          <p-button icon="pi pi-money-bill" label="Donate" @click="visible = true" />
          <p-button icon="pi pi-bookmark" label="Bookmark" severity="secondary" style="margin-left: 0.5em" />
        </template>
      </p-card>
      <Dialog v-model:visible="visible" modal :header="'Make Donation -> ' + details.createdBy"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex gap-3">
          <InputGroup>
            <InputNumber v-model="donationAmount" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" />
            <InputGroupAddon>ETH</InputGroupAddon>
          </InputGroup>
          <p-button icon="pi pi-check" label="Confirm" @click="onConfirm" />
        </div>
      </Dialog>
    </template>

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
import { useCryptoStore } from "@/stores/crypto"
import { getCaseImage, getCaseDetails } from "@/api/pinata.api";
import ProgressBar from "primevue/progressbar";
import Skeleton from "primevue/skeleton";

@Component({
  components: {
    PCard,
    PButton,
    Dialog,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    ProgressBar,
    Skeleton
  },
})
export default class CharityCard extends Vue {
  @Prop()
  charity!: any

  visible = false
  donationAmount = 0
  store = useCryptoStore()
  caseDetails = {title: '', description: '', createdBy: ''}

  async mounted () {
    this.caseDetails = await this.store.getCaseDetails(this.charity.detailsHash)
  }

  convertWeiToEther(weiAmount) {
    const weiAsNumber = Number(weiAmount)
    return weiAsNumber / 1e18
  }

  calcPercent(current, target) {
    return current*100/target
  }

  async onConfirm() {
    const donationData = {
      amount: this.donationAmount,
      caseId: this.charity.id
    };

    // console.log(this.uploadedImage)
    // console.log("donation data!!")
    // console.log(typeof donationData.caseId)

    await this.store.donateToCase(this.store.currentSession.accountId, donationData.amount, donationData.caseId)
    .then(() => {
      console.log('hello')
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      this.visible = false
    })
    this.$emit('confirm-donation')
  }

  get imageLink() {
    return this.store.getCaseImage(this.charity.imageHash)
  }

  get details() {
    if(this.caseDetails) {
      return this.caseDetails
    }
    return {title: '', description: '', createdBy: ''}
  }



}
</script>

<style lang="scss" scoped>
.wrapper {
  display: contents;
}
</style>
