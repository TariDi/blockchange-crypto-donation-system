<template>
  <template v-if="store.pastDonationsLoading || caseDetails.length === 0"></template>
  <template v-else>
    <template v-if="!store.donations || store.donations.length === 0">
      <p-card class="empty-state">
        <template #content>
        <i class="pi pi-exclamation-circle" style="font-size: 15rem; opacity: 0.5;" />
        <span class="text-l">No Donations Found</span>
      </template>
      </p-card>
    </template>
    <template v-else>
    <p-data-view :value="store.donations" paginator :rows="6">
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="col-12"
          >
            <div
              class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
              :class="{ 'border-top-1 surface-border': index > -1 }"
            >
              <div
                class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
              >
                <div
                  class="flex flex-column align-items-center sm:align-items-start gap-3"
                >
                  <div class="text-2xl font-bold text-900">{{ caseDetails[index].title }}</div>
                  <div class="flex align-items-center gap-3">
                    <span class="flex align-items-center gap-2">
                      <i class="pi pi-user"></i>
                      <span class="font-semibold">{{ caseDetails[index].createdBy }}</span>
                    </span>
                  </div>
                </div>
                <div
                  class="flex sm:flex-column justify-items-end align-items-end sm:align-items-end gap-3 sm:gap-2"
                >
                  <p-tag class="text-2xl font-semibold">{{ item.amount }} ETH</p-tag>
                  <span class="text-m font-semibold">{{ formattedTime(item.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </p-data-view>
    </template>
  </template>
</template>

<script lang="ts">
import PDataView from "primevue/dataview";
import PDataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import PButton from "primevue/button";
import { Component, Vue, Setup } from "vue-facing-decorator";
import { ref } from "vue";
import PTimeline from "primevue/timeline";
import { useCryptoStore } from "@/stores/crypto";
import PCard from "primevue/card";
import { getCaseDetails } from "@/api/pinata.api";
import PTag from 'primevue/tag';
import { format } from 'date-fns';

@Component({
  components: {
    PDataView,
    PDataViewLayoutOptions,
    PButton,
    PTimeline,
    PCard,
    PTag
  },
})
export default class DonationTable extends Vue {
  donations= []
  caseDetails = []
  products = ref([
    {
      name: "Case1",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case2",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case3",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case4",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case5",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case6",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case7",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case8",
      category: "Education",
      price: "20 ETH",
    },
    {
      name: "Case9",
      category: "Education",
      price: "20 ETH",
    },
  ]);

  events = ref(["Pending", "Verified", "Received"])

  @Setup((props, ctx) => useCryptoStore())
  store!: any

  async mounted () {
    if(!this.store.refreshLoading) {
      await this.store.getDonations()
      .then(() => {
        this.store.donations.forEach(async (item) => {
          let temp = await this.store.getCaseDetails(item.detailsHash)
          this.caseDetails.push(temp)
        })
        console.log('case detaisl', this.caseDetails)
      })
    }
  }


  formattedTime(timestamp) {
    const myDate = new Date(Number(timestamp)*1000); // Replace with your date object
    return format(myDate, 'MM/dd/yyyy HH:mm:ss');
  }

}
</script>

<style lang="scss">
.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: #aeeae563;
  background-color: #aeeae563;
  color: #0f766e;
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
