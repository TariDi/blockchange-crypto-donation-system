<template>
  <div class="wrapper">
    <p-card style="width: 25em">
      <template #header>
        <img alt="user header" :src="imageLink" width="400" />
      </template>
      <template #title >{{ details.title }}</template>
      <!-- <template #subtitle >
        Created by - {{ details.createdBy }}
      </template> -->
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
      
    </p-card>

  </div>
</template>

<script lang="ts">
import PCard from "primevue/card";
import PDataView from "primevue/dataview";
import InputGroup from "primevue/inputgroup";
import PDataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import PButton from "primevue/button";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import { Component, Prop, Vue } from "vue-facing-decorator";
import { ref } from "vue";
// import PTimeline from "primevue/timeline";
import { useCryptoStore } from "@/stores/crypto";
import { getCaseImage, getCaseDetails } from "@/api/pinata.api";
import ProgressBar from "primevue/progressbar";


@Component({
  components: {
    PCard,
    PDataView,
    PDataViewLayoutOptions,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    PButton,
    ProgressBar
  },
})
export default class DonationCard extends Vue {
  numberOfDonations = 20;

  store = useCryptoStore()
  
  @Prop()
  charity!: any
  caseDetails = {title: '', description: ''}

  async mounted () {
    console.log("HELLOOOO")
    this.caseDetails = await getCaseDetails(this.charity.detailsHash)
  }

  convertWeiToEther(weiAmount) {
    const weiAsNumber = Number(weiAmount)
    return weiAsNumber / 1e18
  }

  calcPercent(current, target) {
    return current*100/target
  }

  get details() {
    if(this.caseDetails) {
      return this.caseDetails
    }
    return {title: '', description: '', createdBy: ''}
  }

  get imageLink() {
    return getCaseImage(this.charity.imageHash)
  }

  events = ref(["Pending", "Verified", "Received"]);
}
</script>


<style lang="scss" scoped>
.wrapper {
  display: contents;
}
</style>
