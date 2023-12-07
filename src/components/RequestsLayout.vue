<template>
    <template v-if="loadingbeneficiaryCases">
    </template>
    <template v-else>
      <template v-if="!beneficiaryCases || beneficiaryCases.length === 0">
        <p-card class="empty-state">
          <template #content>
          <i class="pi pi-exclamation-circle" style="font-size: 15rem; opacity: 0.5;" />
          <span class="text-l">No Requests Found</span>
        </template>
        </p-card>
      </template>
      <template v-else>
        <div class="requests-layout">
          <div v-for="(charity, index) in beneficiaryCases" :key="index">
            <requests-card :charity="charity" :loading="loadingbeneficiaryCases"/>
          </div>
        </div>
      </template>
  </template>
  </template>
  
  <script lang="ts">
  import { Component, Vue } from "vue-facing-decorator";
  import RequestsCard from "./RequestsCard.vue";
  import { useCryptoStore } from "@/stores/crypto";
  import PCard from "primevue/card";
  
  @Component({
    components: {
      RequestsCard,
      PCard
    },
  })
  export default class RequestsLayout extends Vue {
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
  .requests-layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 48px;
    margin-left: 5vw;
  }

  .empty-state {
  padding:50px;
  border-radius: 4px;
}

.empty-state .p-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }
  </style>
  