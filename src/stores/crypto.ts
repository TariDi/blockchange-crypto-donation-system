import { defineStore } from "pinia";
import { Web3 } from "web3";
import { ref } from "vue"; 
import Charity from '../abis/Charity.json'
import type { AbiItem } from '@/types'
import detectEthereumProvider from '@metamask/detect-provider'

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    accounts: {} as any,
    loader: false,
    balance: 0,
    web3: localStorage.getItem('web3Instance') as Web3 | null,
    accountId: "",
    abi: localStorage.getItem('abi') as AbiItem[] | null,
    charityContract: localStorage.getItem('charityContract'),
    _tmpUserData: ['alice0130', 'bob0228', 'carol0315', 'david0420', 'erin0506',
    'fr@nk0609', 'grace0723', 'heidi0811', 'ivan0927', 'james1010'] as any,
    currentSession: localStorage.getItem('activeSession') as any

  }),
  actions: {
    async initialize() {
      try {
        this.web3 = new Web3("http://localhost:7545")
        //localStorage.setItem('web3Instance', JSON.stringify(this.web3))
        const result = await this.web3.eth.getAccounts()
        console.log(result)
        this.abi = Charity.abi
        //localStorage.setItem('abi', JSON.stringify(this.abi))
        this.charityContract = new this.web3.eth.Contract(this.abi, '0x8c1091862B838060D46b32373DDD5F208a636420')
        //localStorage.setItem('charityContract', JSON.stringify(this.charityContract))
        result.forEach((accountId: string, idx: number) => {
          if(idx>0){
            this.accounts[result[idx].toLowerCase()] = {
                username: this._tmpUserData[idx-1],
                donor: (idx < 6) ? true : false,
                authenticated: false
            }
          }
        })
        console.log(this.accounts)
      } catch (e) {
        //throw new Error("Couldn't connect to server")
        console.error(e)
      }
    },
    async pushNewCase(accountId: string, detailsHash: string, imageHash: string, target: number) {
        try {
            console.log('------Arguments---------')
            console.log(accountId)
            console.log(imageHash)
            console.log(detailsHash)
            console.log('---------------')
            const weiAmount = this.web3.utils.toWei(target.toString(), 'ether');
            const receipt = await this.charityContract.methods.createCaseByBeneficiary(
              weiAmount,
              detailsHash,
              imageHash
            ).send({from: accountId, gas: 2000000})
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
    async setCurrentSession() {
      try {
        let loggedIn: any[] = []
        if(window.ethereum) {
          await window.ethereum.request({method: "wallet_requestPermissions", params: [{ eth_accounts: {} }]})
          loggedIn = await window.ethereum.request({method: "eth_requestAccounts"})
          console.log('you have metamask')
          console.log(loggedIn)
          this.currentSession = {
            accountId: loggedIn[0].toLowerCase(),
            username: this.accounts[loggedIn[0].toLowerCase()].username,
            donor: this.accounts[loggedIn[0].toLowerCase()].donor
          }
          this.accounts[loggedIn[0].toLowerCase()].authenticated = true
          localStorage.setItem('activeSession', JSON.stringify(this.currentSession))
          console.log(this.currentSession)
        }
      }catch (e) {
        console.error(e)
      }
      
    },
    async flushCurrentSession() {
      this.currentSession = null
      localStorage.clear()
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
    loadActiveSession() {
      const storedActiveSession = localStorage.getItem('activeSession');
      if (storedActiveSession) {
        this.currentSession = JSON.parse(storedActiveSession)
      }
    }
  },
});
