<template>
    <div class="wrapper">
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
        <p-card style="width: 28em">
          <template #header>
            <img alt="user header" :src="imageLink" width="448" />
          </template>
          <template #title >{{ details.title }}</template>
          <template #subtitle >
            Created on {{ formattedTime(charity.timestamp) }}
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
          
        </p-card>
      </template>
  
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
  import Skeleton from "primevue/skeleton";
  import { format } from 'date-fns'
  
  
  @Component({
    components: {
      PCard,
      PDataView,
      PDataViewLayoutOptions,
      InputGroup,
      InputGroupAddon,
      InputNumber,
      PButton,
      ProgressBar,
      Skeleton
    },
  })
  export default class RequestsCard extends Vue {
    numberOfDonations = 20;
  
    store = useCryptoStore()
    
    @Prop()
    charity!: any

    @Prop({default: true})
    loading!: boolean

    caseDetails = {title: '', description: ''}
  
    async mounted () {
      console.log("HELLOOOO")
      this.caseDetails = await this.store.getCaseDetails(this.charity.detailsHash)
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
      return this.store.getCaseImage(this.charity.imageHash)
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
  