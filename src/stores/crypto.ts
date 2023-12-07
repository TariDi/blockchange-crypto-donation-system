import { defineStore } from "pinia";
import { Web3 } from "web3";
import { ref } from "vue"; 
import Charity from '../abis/Charity.json'
import type { AbiItem } from '@/types'
import detectEthereumProvider from '@metamask/detect-provider'
import { deleteCaseDetails } from "@/api/pinata.api";
import { getCaseImage, getCaseDetails, uploadCaseDetails, uploadFile } from "@/api/pinata.api";

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    accounts: {} as any,
    loader: false,
    balance: 0,
    web3: null as Web3 | null,
    accountId: "",
    abi: null as AbiItem[] | null,
    charityContract: null,
    _tmpUserData: ['alice0130', 'bob0228', 'carol0315', 'david0420', 'erin0506',
    'fr@nk0609', 'grace0723', 'heidi0811', 'ivan0927', 'james1010'] as any,
    currentSession: JSON.parse(localStorage.getItem('activeSession')) as any,
    refreshLoading: true,
    donations: [],
    pastDonationsLoading: false,
    pinataDetailsLoading: false,
    pinataImageLoading: false,
    donateLoading: false,
  }),
  actions: {
    async initialize() {
      this.refreshLoading = true
      try {
        this.web3 = new Web3("http://localhost:7545")
        //localStorage.setItem('web3Instance', JSON.stringify(this.web3))
        const result = (await this.web3.eth.getAccounts()).map((item) => item.toLowerCase())
        this.currentSession = JSON.parse(localStorage.getItem('activeSession'))
        // console.log(result)
        this.abi = Charity.abi
        //localStorage.setItem('abi', JSON.stringify(this.abi))
        this.charityContract = new this.web3.eth.Contract(this.abi, '0xaB3B20c97d94734b381FBE41C38d424fE2bD3E58')
        console.log('In initialize')
        //localStorage.setItem('charityContract', JSON.stringify(this.charityContract))
        result.forEach((accountId: string, idx: number) => {
          if(idx>0){
            this.accounts[result[idx]] = {
                username: this._tmpUserData[idx-1],
                donor: (idx < 6) ? true : false,
                authenticated: this.currentSession? result[idx] === this.currentSession.accountId : false
            }
          }
        })
        //console.log(this.accounts)
      } catch (e) {
        //throw new Error("Couldn't connect to server")
        console.error(e)
      } finally {
        this.refreshLoading = false
      }
    },
    async pushNewCase(accountId: string, detailsHash: any, imageHash: string, target: number) {
        try {
            // console.log('------Arguments---------')
            // console.log(accountId)
            // console.log(imageHash)
            // console.log(detailsHash)
            // console.log('---------------')
            const weiAmount = this.web3.utils.toWei(target.toString(), 'ether');
            const receipt = await this.charityContract.methods.createCaseByBeneficiary(
              weiAmount,
              detailsHash,
              imageHash
            ).send({from: accountId, gas: 2000000})
            // console.log('------Receipt---------')
            // console.log(receipt)
            // console.log('-------Methods---------')
            // console.log(this.charityContract.methods)
            // console.log('--------Events----------')
            // console.log(this.charityContract.events)
            // console.log('----------------------')
            if (receipt.events.CaseCreated) {
                const { caseId, createdBy, timestamp } = receipt.events.CaseCreated.returnValues;
                //console.log(`CaseCreated event received: CaseId ${caseId}, CreatedBy ${createdBy}, Timestamp ${timestamp}`)
            }
        }
        catch(error) {
            deleteCaseDetails(detailsHash, imageHash)
            console.error(error)
        }
    },
    async loadActiveCases() {
      try {
        if (this.charityContract) {
        const getActiveCases = await this.charityContract.methods.listActiveCases().call()
        // console.log("***********active cases*****************")
        // console.log(getActiveCases)
        return getActiveCases
        }
      } catch(error) {
        console.error(error)
      }
    },
    async donateToCase(accountId: string, donateAmount: Number, caseId: string) {
      this.donateLoading = true
      try {
        const weiAmount = this.web3.utils.toWei(donateAmount.toString(), 'ether');
        const receipt = await this.charityContract.methods.donate(
          caseId
        ).send({from: accountId,value: weiAmount, gas: 200000})
        // console.log("*******************donate to Case************************")
        // console.log(receipt)
        if (receipt.events.Donate) {
          const { caseId, donatedBy, donatedAmount, timestamp } = receipt.events.Donate.returnValues;
          // console.log(`Donated event received: CaseId ${caseId}, donatedBy ${donatedBy}, donatedAmount ${donatedAmount}, Timestamp ${timestamp}`)
      }
      } catch(error) {
        console.error(error)
      }
      finally {
        this.donateLoading = false
      }
    },
    async setCurrentSession() {
      try {
        let loggedIn: any[] = []
        if(window.ethereum) {
          await window.ethereum.request({method: "wallet_requestPermissions", params: [{ eth_accounts: {} }]})
          loggedIn = await window.ethereum.request({method: "eth_requestAccounts"})
          // console.log('you have metamask')
          // console.log(loggedIn)
          this.currentSession = {
            accountId: loggedIn[0].toLowerCase(),
            username: this.accounts[loggedIn[0].toLowerCase()].username,
            donor: this.accounts[loggedIn[0].toLowerCase()].donor
          }
          this.accounts[loggedIn[0].toLowerCase()].authenticated = true
          localStorage.setItem('activeSession', JSON.stringify(this.currentSession))
          // console.log(this.currentSession)
        }
      }catch (e) {
        console.error(e)
      }
      
    },
    async flushCurrentSession() {
      this.currentSession = null
      localStorage.clear()
    },
    async getDonations() {
      this.pastDonationsLoading = true
        await this.charityContract.getPastEvents( 
          'Donate', 
          {
            filter: {donor: this.currentSession.accountId},
            fromBlock: 0,
            toBlock: 'latest'
          })
            .then((response)=> {
              this.donations = response.map((event) => {
                return {
                  timestamp: event.returnValues.timestamp,
                  amount: this.web3?.utils.fromWei(event.returnValues.amount, 'ether'),
                  detailsHash: event.returnValues.detailsHash
                }
              }).reverse()
              console.log(this.donations)
            })
            .catch((error) => {
              console.error(error)
            })
            .finally(() => {
              this.pastDonationsLoading = false
            })
    },
    async getBalance() {
      //setLoader()
      try {
        const result = await this.web3.eth.getBalance(this.accountId);
        this.balance = this.web3.utils.fromWei(result, "ether");
        // console.log(this.balance);
      } catch (e) {
        console.error(e);
      }
    },
    async getBeneficiaryCaseDetails(accountId: string) {
      try {
        if (this.charityContract) {
        const getBeneficiaryCases = await this.charityContract.methods.getBeneficiaryCases(accountId).call()
        console.log("***********beneficiary cases*****************")
        console.log(getBeneficiaryCases)
        return getBeneficiaryCases
        }
      } catch(error) {
        console.log(error)
      }
    },
    loadActiveSession() {
      const storedActiveSession = localStorage.getItem('activeSession');
      if (storedActiveSession) {
        this.currentSession = JSON.parse(storedActiveSession)
      }
    },
    getCaseImage(imageHash: string) {
      this.pinataImageLoading = true
      let result: any
      try {
        result = getCaseImage(imageHash)
      }
      catch(e) {
        console.error(e)
      }
      finally{
        this.pinataImageLoading = false
      }
      return result
    },
    async getCaseDetails(detailsHash: string) {
      this.pinataDetailsLoading = true
      let result: any
      await getCaseDetails(detailsHash)
        .then((res) => {
          result = res
        })
        .catch((e) => console.error(e))
        .finally(() => setTimeout(()=>{this.pinataDetailsLoading = false}, 200))
        return result
    },
  },
});
