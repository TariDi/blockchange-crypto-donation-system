<template>
  <div class="pt-10 wrapper flex justify-items-center">
    <p-card>
      <template #title>
        <div class="pt-4 pl-6 pr-6 text-4xl">Create A New Fund Request</div>
      </template>
      <template #content>
        <div class="pr-6 pl-6 flex flex-column gap-6">
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
          <!-- <div class="flex flex-column gap-2">
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
          </div> -->
        </div>
      </template>
      <template #footer>
        <div class="pb-6 pl-6 pr-6">
          <p-button icon="pi pi-check" label="Submit" @click="onSubmit" />
          <p-button icon="pi pi-times" label="Clear" severity="secondary" style="margin-left: 0.5em" />
        </div>
      </template>
    </p-card>
    <Dialog v-model:visible="visible" modal header="Yay!" :dismissableMask="true" :closeOnEscape="true"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="flex justify-content-center gap-3">
        <span>Case Successfully Created</span>
        <i class="pi pi-check success" />
      </div>
    </Dialog>
    <img :src="downloadImageLink" width="300" height="200"/>
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
  visible = false
  caseTitle: string = ''
  caseDescription = ''
  targetAmount: number = 0
  image: any = null
  uploadedFile: string = ''
  uploadedImage = null
  downloadImageLink = ''

  store = useCryptoStore();

  onUpload(e) {
    this.uploadedFile = e.formData.get('file').name
    this.uploadedImage = e.formData
  }

  async onSubmit() {
    const textData = {
      title: this.caseTitle,
      description: this.caseDescription,
      pinataMetadata: {
        name: this.caseTitle.replace(/[^a-zA-Z0-9]/g, '')
      }
    }

    // console.log(this.uploadedImage)
    console.log(textData)
    // // const imageHash = uploadFile(this.uploadedImage)
    // // const detailsHash = uploadCaseDetails(textData)
    //this.downloadImageLink = getCaseDetails('Qma8CWYsSucSNCz7chztuBGssoBDAdkeYsu97jWNFibVYq', 'QmbHuPLWFY4YXBciPKUwGMaSQ4yR5o3iNKtEy6Tu2cjP5T')
    //this.downloadImageLink

    await this.store.pushNewCase("0x13fCa35A7adee3Fb9ca8a0E3Ed6C0bB62BfA8Fcf", "98765", "987654321", 60)

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
