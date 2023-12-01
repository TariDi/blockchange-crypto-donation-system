<template>
    <p-data-view :value="products" paginator :rows="6">
    <template #list="slotProps">
        <div class="grid grid-nogutter">
            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4" :class="{ 'border-top-1 surface-border': index !== 0 }">
                    <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src="@/assets/best-fundraising-websites.png" :alt="item.name" />
                    <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div class="text-2xl font-bold text-900">{{ item.name }}</div>
                            <div class="flex align-items-center gap-3">
                                <span class="flex align-items-center gap-2">
                                    <i class="pi pi-book"></i>
                                    <span class="font-semibold">{{ item.category }}</span>
                                </span>

                            </div>
                        </div>
                        <p-timeline :value="events" layout="horizontal">
                            <template #content="slotProps">
                                <span class="text-sm"> {{ slotProps.item }}</span>
                            </template>
                        </p-timeline>
                        <div class="flex sm:flex-column justify-items-center align-items-center sm:align-items-center gap-3 sm:gap-2">
                            <span class="text-2xl font-semibold">${{ item.price }}</span>
                            <p-button icon="pi pi-arrow-right" rounded />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</p-data-view>
</template>

<script lang="ts">
import PDataView from 'primevue/dataview';
import PDataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import PButton from 'primevue/button'
import { Component, Vue } from 'vue-facing-decorator'
import { ref } from "vue"
import PTimeline from 'primevue/timeline'

@Component({
    components: {
        PDataView,
        PDataViewLayoutOptions,
        PButton,
        PTimeline
    },
})
export default class DonationTable extends Vue {
    numberOfDonations = 20

    products = ref([
                {
                    name: "Case1",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case2",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case3",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case4",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case5",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case6",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case7",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case8",
                    category: "Education",
                    price: '20 ETH'
                },
                {
                    name: "Case9",
                    category: "Education",
                    price: '20 ETH'
                }
    ])

    events = ref(['Pending', 'Verified', 'Received']);
}

</script>

<style lang="scss">
.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
    background: #aeeae563;
    background-color: #aeeae563;
    color: #0f766e;
}

.p-timeline {
    flex-grow: 0.4;
}
</style>
