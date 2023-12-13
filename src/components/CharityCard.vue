<template>
  <div class="wrapper" v-if="showCard">
    <template v-if="store.pinataDetailsLoading || loading">
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
          <span class="text-sm">Created by </span>
          <span class="text-m font-semibold">{{ details.createdBy }}</span>
          <span class="text-sm"> on {{ formattedTime(charity.timestamp) }}</span>
        </template>
        <template #content v-if="caseDetails !== undefined">
          <div class="mb-4 text-sm">
            {{ details.description }}
          </div>
          <div class="mb-1">
            <ProgressBar :value="calcPercent(convertWeiToEther(charity.currentAmount), convertWeiToEther(charity.targetAmount))"> {{ convertWeiToEther(charity.currentAmount) }} </ProgressBar>
            <div class="p-1 flex flex-row justify-content-between">
              <span class="text-xs font-normal"> Raised: {{ convertWeiToEther(charity.currentAmount) }} </span>
              <span class="text-xs font-bold"> Target: {{ convertWeiToEther(charity.targetAmount) }} </span>
            </div>
          </div>
        </template>
        <template #footer>
          <p-button icon="pi pi-money-bill" label="Donate" severity="secondary" @click="visible = true" />
        </template>
      </p-card>
      <Dialog v-model:visible="visible" modal :header="'Make Donation -> ' + details.createdBy"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex gap-3">
          <InputGroup>
            <InputNumber v-model="donationAmount" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" />
            <InputGroupAddon>ETH</InputGroupAddon>
          </InputGroup>
          <p-button icon="pi pi-check" label="Confirm" @click="confirmDonation($event)" />
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
import { Component, Prop, Vue, Watch, Setup } from "vue-facing-decorator";
import type { Ref } from "vue";
import { useCryptoStore } from "@/stores/crypto"
import { getCaseImage, getCaseDetails } from "@/api/pinata.api";
import ProgressBar from "primevue/progressbar";
import Skeleton from "primevue/skeleton";
import { format } from 'date-fns';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

@Component({
  components: {
    PCard,
    PButton,
    Dialog,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    ProgressBar,
    Skeleton,
    Toast
  },
})
export default class CharityCard extends Vue {
  @Prop()
  charity!: any

  @Prop()
  selectedTag!: string

  @Prop({default: true})
  loading!: boolean

  @Watch('selectedTag')
  onSelectedTagChange() {
    console.log(this.selectedTag)
    if(this.selectedTag.length>0) {
      const regex = new RegExp(this.selectedTag, "i") // "i" flag for case-insensitivity
      this.showCard = regex.test(this.caseDetails.title) || regex.test(this.caseDetails.description)
      // this.showCard = this.caseDetails.title.includes(this.selectedTag) || this.caseDetails.title.includes(this.selectedTag)
    } else {
      this.showCard = true
    }
  }

  visible = false
  showCard = true
  donationAmount = 0
  store = useCryptoStore()
  caseDetails = {title: '', description: '', createdBy: ''}

  toast= useToast()
  confirm = useConfirm();

  async mounted () {
    if(this.charity) {
    console.log(this.charity)
    this.caseDetails = await this.store.getCaseDetails(this.charity.detailsHash)
    if(this.selectedTag.length>0) {
      const regex = new RegExp(this.selectedTag, "i") // "i" flag for case-insensitivity
      this.showCard = regex.test(this.caseDetails.title) || regex.test(this.caseDetails.description)
      // this.showCard = this.caseDetails.title.includes(this.selectedTag) || this.caseDetails.title.includes(this.selectedTag)
    } else {
      this.showCard = true
    }
  }
  }

  convertWeiToEther(weiAmount) {
    const weiAsNumber = Number(weiAmount)
    return weiAsNumber / 1e18
  }

  calcPercent(current, target) {
    return current*100/target
  }

  confirmDonation(event) {
      this.$confirm.require({
          target: event.currentTarget,
          message: 'Are you sure you want to proceed?',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
              await this.onConfirm()
          },
          reject: () => {
              this.$toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
          }
      });
  }

  async onConfirm() {
    const donationData = {
      amount: this.donationAmount,
      caseId: this.charity.id
    };

    this.store.donateToCase(this.store.currentSession.accountId, donationData.amount, donationData.caseId)
    .then(() => {
      this.$emit('confirm-donation')
      this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Donation sent', life: 3000 })
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      this.visible = false
    })
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

  formattedTime(timestamp) {
    if(timestamp) {
      const myDate = new Date(Number(timestamp)*1000); // Replace with your date object
      return format(myDate, 'MM/dd/yyyy');
    }
    else return ''
  }



}
</script>

<style lang="scss" scoped>
.wrapper {
  display: contents;
}
</style>
