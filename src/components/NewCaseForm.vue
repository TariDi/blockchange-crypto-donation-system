<template>
    <div class="pt-10 wrapper flex justify-items-center">
        <p-card>
        <template #title>
            <div class="pt-4 pl-6 pr-6 text-4xl">
                Create A New Fund Request
            </div>
        </template>
        <template #content>
            <div class="pr-6 pl-6 flex flex-column gap-6">
                <div class="flex flex-column gap-2">
                    <label for="title">Title</label>
                    <InputText 
                        id="title"
                        v-model="caseTitle"
                        placeholder="Give a name to your case"
                        aria-describedby="title-help" />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="desc">Description</label>
                    <Textarea 
                        v-model="caseDescription"
                        rows="7"
                        cols="30"
                        placeholder="A short description of your case"
                    />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="target">Target Amount</label>
                    <InputGroup>
                        <InputNumber v-model="targetAmount" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" />
                        <InputGroupAddon>ETH</InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="pb-6 pl-6 pr-6">
                <p-button icon="pi pi-check" label="Submit" @click="visible=true"/>
                <p-button icon="pi pi-times" label="Clear" severity="secondary" style="margin-left: 0.5em" />
            </div>
        </template>
        </p-card>
        <Dialog v-model:visible="visible" modal header="Yay!" :dismissableMask="true" :closeOnEscape="true" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="flex justify-content-center gap-3">
                <span>Case Successfully Created</span>
                <i class="pi pi-check success"/>
            </div>
        </Dialog>
    </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import PCard from 'primevue/card'
import PButton from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import TextArea from 'primevue/textarea'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"

@Component({
    components: {
        PCard,
        PButton,
        Dialog,
        InputGroup,
        InputGroupAddon,
        InputNumber,
        InputText,
        TextArea
    }
})
export default class NewCaseForm extends Vue {
    visible = false
    confirm = useConfirm()
    toast = useToast()

    created() {
        this.confirm = useConfirm()
        this.toast = useToast()
    }

    confirm1(event) {
    console.log(event.currentTarget)
    this.confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        },
        reject: () => {
            this.toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    })
}
    
}
</script>


<style lang="scss" scoped>

.success {
    color: green;
    border: 2px solid green;
    border-radius: 100px;
    padding: 4px;
    font-size: 1rem;
    font-weight: 2px;
}
</style>