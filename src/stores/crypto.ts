import { defineStore } from "pinia";
import { Web3 } from "web3";
import { ref } from "vue";

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    accounts: [] as string[],
    loader: false,
    balance: 0,
    web3: null,
    accountId: "",
    donorAccount: null as boolean | null,
    abi: null,
    charityContract:null

  }),
  actions: {
    setAccountType(type: boolean) {
      this.donorAccount = type;
    },
    async initialize() {
      try {
        this.web3 = new Web3("http://localhost:7545")
        this.abi = require('build/contracts/Charity.json')
        this.charityContract = new this.web3.eth.Contract(this.abi, '0x091d45C9892F8751531a556737687cD2269Ed57F')
      } catch (e) {
        console.error(e);
      }
    },
    setDonorAccount(donor) {
      this.donorAccount = donor;
    },

    async getAccounts() {
      try {
        this.accounts = await this.web3.eth.getAccounts();
        this.accountId = this.donorAccount
          ? this.accounts[1]
          : this.accounts[9]
        const receipt = await this.charityContract.methods.createCaseByNeedy(
            'Dummy',
            'Hello Shreya, this project is fun!',
            20
        ).send({from: this.accountId})
        console.log('------Receipt---------')
        console.log(receipt)
        console.log('-------Methods---------')
        console.log(this.charityContract.methods)
        console.log('--------Events----------')
        console.log(this.charityContract.events)
        console.log('----------------------')
        if (receipt.events.CaseCreated) {
            const { caseId, createdBy, timestamp } = receipt.events.CaseCreated.returnValues;
            console.log(`CaseCreated event received: CaseId ${caseId}, CreatedBy ${createdBy}, Timestamp ${timestamp}`)
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getBalance() {
      //setLoader()
      try {
        const result = await this.web3.eth.getBalance(this.accountId);
        this.balance = this.web3.utils.fromWei(result, "ether");
        console.log(this.balance);
      } catch (e) {
        console.error(e);
      }
    },
  },
});
