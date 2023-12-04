import { defineStore } from "pinia";
import { Web3 } from "web3";
import { ref } from "vue"; 
import Charity from '../abis/Charity.json'
import type { AbiItem } from '@/types'

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    accounts: [] as any[],
    loader: false,
    balance: 0,
    web3: null as Web3 | null,
    accountId: "",
    abi: null as AbiItem[] | null,
    charityContract: null,
    _tmpUserData: ['alice0130', 'bob0228', 'carol0315', 'david0420', 'erin0506',
    'fr@nk0609', 'grace0723', 'heidi0811', 'ivan0927', 'james1010'] as any

  }),
  actions: {
    setAccountType(type: boolean) {
      this.donorAccount = type;
    },
    async initialize() {
      try {
        this.web3 = new Web3("http://localhost:7545")
        this.abi = Charity.abi
        this.charityContract = new this.web3.eth.Contract(this.abi, '0x504542d716550c32dDb7f72ef1CFa951D15822d2')
      } catch (e) {
        console.error(e);
      }
    },
    async getAccounts() {
        this.web3.eth.getAccounts()
        .then((result)=> {
            this._tmpUserData.forEach((user: string, idx: number) => {
                this.accounts.push({
                    username: user,
                    accountId: result[idx],
                    donor: (idx < 5) ? true : false
                })
            })
        })
        .catch((error) => {
            console.error("Couldn't connect to server.")
        })
    },
    async pushNewCase(accountId: string, detailsHash: string, imageHash: string, target: number) {
        try {
            const weiAmount = this.web3.utils.toWei(target.toString(), 'ether');
            const receipt = await this.charityContract.methods.createCaseByBeneficiary(
              weiAmount,
              detailsHash,
              imageHash
            ).send({from: accountId, gas: 200000})
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
        }
        catch(error) {
            console.error(error)
        }
    },
    async loadActiveCases() {
      try {
        const getActiveCases = await this.charityContract.methods.listActiveCases().call()
        console.log("***********active cases*****************")
        console.log(getActiveCases);
        return getActiveCases;
      } catch(error) {
        console.log(error)
      }
    },
    async donateToCase(accountId: string, donateAmount: Number, caseId: string) {
      try {
        const weiAmount = this.web3.utils.toWei(donateAmount.toString(), 'ether');
        const receipt = await this.charityContract.methods.donate(
          caseId
        ).send({from: accountId,value: weiAmount, gas: 200000})
        console.log("*******************donate to Case************************")
        console.log(receipt)
        if (receipt.events.Donate) {
          const { caseId, donatedBy, donatedAmount, timestamp } = receipt.events.Donate.returnValues;
          console.log(`Donated event received: CaseId ${caseId}, donatedBy ${donatedBy}, donatedAmount ${donatedAmount}, Timestamp ${timestamp}`)
      }
      } catch(error) {
        console.log(error)
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
