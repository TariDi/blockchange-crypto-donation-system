import { defineStore } from 'pinia'
import { Web3 } from 'web3'
import { ref } from 'vue'

export const useCryptoStore = defineStore('crypto', {
    state: () => ({
        accounts: [] as string[],
        loader: false,
        balance: 0 as bigint,
        web3: null
    }),
    actions: {
        initialize() {
            try{
                this.web3 = new Web3('http://localhost:7545')
            }
            catch(e) {
                console.error(e)
            }

        },
        async getAccounts() {
            try {
                this.accounts = await this.web3.eth.getAccounts()
            }
            catch(e) {
                console.error(e)
            }
        },
        async getBalance() {
            //setLoader()
            try {
                const web3 = new Web3('http://localhost:7545')
                console.log(this.accounts[0])
                const result = await this.web3.eth.getBalance(this.accounts[0])
                // The balance is returned in Wei. You can convert it to Ether or other units.
                // const balanceInEther = web3.utils.fromWei(balance, 'ether');
                // console.log(`Balance of ${accounts[0]}: ${balanceInEther} ETH`);
                this.balance = web3.utils.fromWei(result, 'ether')
                console.log(this.balance)
            }
            catch(e) {
                console.error(e)
            }
        }
    }
  })