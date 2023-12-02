import { defineStore } from "pinia";
import { Web3 } from "web3";
import { ref } from "vue"; 
import Charity from '../abis/Charity.json';

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
        this.abi = Charity.abi
        this.charityContract = new this.web3.eth.Contract(this.abi, '0x940b35D5A13a658291FDD0201b002f0F20Ba0BF8')
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
        ).send({from: this.accountId, gas: 200000})
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
