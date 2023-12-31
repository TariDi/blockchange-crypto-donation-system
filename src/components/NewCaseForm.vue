<template>
  <div class="pt-10 wrapper flex justify-items-center">
    <p-card>
      <template #title>
        <div class="pt-4 pl-6 pr-6 text-4xl">Create A New Fund Request</div>
      </template>
      <template #content>
        <div class="pr-6 pl-6 flex flex-column gap-4">
          <div class="flex flex-column gap-2">
            <label for="title">Title</label>
            <InputText id="title" v-model="caseTitle" placeholder="Give a name to your case" />
          </div>
          <div class="flex flex-column gap-2">
            <label for="desc">Description</label>
            <TextArea v-model="caseDescription" placeholder="Briefly describe your case" autoResize rows="7" cols="30" />
          </div>
          <div class="flex flex-column gap-2">
            <label for="target">Target Amount</label>
            <InputGroup>
              <InputNumber v-model="targetAmount" inputId="minmaxfraction" :minFractionDigits="2"
                :maxFractionDigits="5" />
              <InputGroupAddon>ETH</InputGroupAddon>
            </InputGroup>
          </div>
          <div class="flex flex-column gap-2">
            <label>Upload a creative image (optional)</label>
            <div class="flex align-items-center gap-4">
              <FileUpload
                mode="basic"
                name="file"
                accept="image/*"
                :maxFileSize="1000000"
                @before-send="onUpload($event)"
                auto
              />
              <label>{{ uploadedFile }}</label>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="pb-6 pl-6 pr-6">
          <p-button icon="pi pi-check" label="Submit" @click="submitCase($event)" />
          <p-button icon="pi pi-times" label="Clear" severity="secondary" style="margin-left: 0.5em" @click="clearForm($event)"/>
        </div>
      </template>
    </p-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator"
import PCard from "primevue/card"
import PButton from "primevue/button"
import Dialog from "primevue/dialog"
import InputGroup from "primevue/inputgroup"
import InputGroupAddon from "primevue/inputgroupaddon"
import InputNumber from "primevue/inputnumber"
import InputText from "primevue/inputtext"
import TextArea from "primevue/textarea"
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import FileUpload from 'primevue/fileupload'
import { ref } from "vue"
import type { Ref } from 'vue'
import { uploadFile, uploadCaseDetails } from '@/api/pinata.api'
import { useCryptoStore } from "@/stores/crypto"

@Component({
  components: {
    PCard,
    PButton,
    Dialog,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    InputText,
    TextArea,
    FileUpload
  },
})
export default class NewCaseForm extends Vue {
  caseTitle: string = ''
  caseDescription = ''
  targetAmount: number = 0
  image: any = null
  uploadedFile: string = ''
  uploadedImage = null
  downloadImageLink = ''

  store = useCryptoStore()

  onUpload(e) {
    this.uploadedFile = e.formData.get('file').name
    this.uploadedImage = e.formData
  }

  submitCase(event) {
      this.$confirm.require({
          target: event.currentTarget,
          message: 'Are you sure you want to proceed?',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
              await this.onSubmit()
          },
          reject: () => {
              this.$toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
          }
      });
  }

  async onSubmit() {
    const textData = {
      pinataContent: {
        title: this.caseTitle,
        description: this.caseDescription,
        createdBy: this.store.currentSession.username
      },
      pinataMetadata: {
        name: this.caseTitle.replace(/[^a-zA-Z0-9]/g, '')
      }
    }

    // console.log(this.uploadedImage)
    console.log(textData)
    const imageHash = await uploadFile(this.uploadedImage)
    const detailsHash = await uploadCaseDetails(textData)
    
    await this.store.pushNewCase(this.store.currentSession.accountId, detailsHash, imageHash, this.targetAmount)
    .then((res) => {
      this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Case created.', life: 3000 })
    })
    .finally(() => {
      this.caseTitle = ''
      this.caseDescription = ''
      this.targetAmount = 0
      this.image = null
      this.uploadedFile = ''
      this.uploadedImage = null
      this.downloadImageLink = ''
    })

  }

  clearForm(event) {
    location.reload()
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
