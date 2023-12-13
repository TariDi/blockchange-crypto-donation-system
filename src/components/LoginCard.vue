<template>
  <p-card class="login">
    <template #header>
      <span class="text-xl">Give Hope, Change Lives</span>
    </template>
    <template #content>
      <!--<p-tab-view>
        <p-tab-panel header="Donor Account">
          <div class="login-tab">
            <div class="login-details">
              <div class="login-username">
                <p-input-text
                  type="text"
                  v-model="value"
                  placeholder="Username"
                />
              </div>
              <div class="login-password">
                <p-password
                  v-model="donorPassword"
                  placeholder="Password"
                  :feedback="false"
                  toggleMask
                />
              </div>
            </div>
            <div>
              <p-button
                type="submit"
                label="Submit"
                :loading="submitLoading"
                @click="attemptLogin"
              />
            </div>
          </div>
        </p-tab-panel>
        <p-tab-panel header="Beneficiary Account" @click="toggleTheme">
          <div class="login-tab">
            <div class="login-details">
              <div class="login-username">
                <p-input-text
                  type="text"
                  v-model="value"
                  placeholder="Username"
                />
              </div>
              <div class="login-password">
                <p-password
                  v-model="donorPassword"
                  placeholder="Password"
                  :feedback="false"
                  toggleMask
                />
              </div>
            </div>
            <div>
              <p-button
                type="submit"
                label="Submit"
                :loading="submitLoading"
                @click="attemptLogin"
              />
            </div>
          </div>
        </p-tab-panel>
      </p-tab-view>-->
      
      <div class="login-view">
      <p-button
        type="submit"
        label="Connect with MetaMask"
        :loading="submitLoading"
        @click="attemptLogin"
      />
      <img src="@/assets/donation-money-vector-flat-illustration.webp" class="login-image"/>
      </div>
    </template>
  </p-card>
</template>

<script lang="ts">
import PTabView from "primevue/tabview";
import PTabPanel from "primevue/tabpanel";
import { Vue, Component } from "vue-facing-decorator";
import PInputText from "primevue/inputtext";
import PCard from "primevue/card";
import PPassword from "primevue/password";
import PButton from "primevue/button";
import { ref } from "vue";
import { usePrimeVue } from "primevue/config";
import { useCryptoStore } from "@/stores/crypto";
import { error } from "console";

@Component({
  components: {
    PTabView,
    PTabPanel,
    PInputText,
    PCard,
    PPassword,
    PButton,
  },
})
export default class LoginCard extends Vue {
  value: string = "";
  donorPassword: string = "";
  beneficiaryPassword: string = "";
  submitLoading = false;
  // set default theme folder-name to currentTheme
  currentTheme = ref("lara-light-teal");
  PrimeVue = usePrimeVue();

  store = useCryptoStore()

  async mounted () {
    await this.store.initialize()
  }

  async attemptLogin() {
    // console.log(this.value)
    this.submitLoading = true;
    this.authenticate()
    .then((result) => {
      if(result){
        //this.store.setCurrentSession(this.value)
        this.$router.push(
          {
            name: this.store.currentSession.donor? "donor" : "beneficiary",
            params: {username: this.store.currentSession.username}
          }
        )
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(()=> {
      this.submitLoading = false
    })
    
    //await this.store.getBalance()
  }

  // async attemptLoginBeneficiary() {
  //   this.submitLoading = true
  //   this.authenticate(false)
  //   .then((result) => {
  //     if(result){
  //       //this.store.setCurrentSession()
  //       this.$router.push({name: "beneficiary", params: {username: this.store.currentSession.username}})
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
  //   .finally(()=> {
  //     this.submitLoading = false
  //   })
  // }

  async authenticate() {
    return new Promise(async (resolve, reject) => {
      this.store.setCurrentSession()
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        reject(new Error("Could not connect to server."))
      })
    })
  }

  // change current theme to next
  toggleTheme() {
    // What is next theme? (2nd parameter)
    let nextTheme = "lara-light-teal";
    if (this.currentTheme.value === "lara-light-teal") nextTheme = "viva-light";
    else if (this.currentTheme.value === "viva-light")
      nextTheme = "lara-light-teal";

    // 1. Current theme name
    // 2. Next theme name
    // 3. id of <link>, what reference to where set theme css file --> fix, single id to <link>
    this.PrimeVue.changeTheme(
      this.currentTheme.value,
      nextTheme,
      "theme-id-link",
      () => {},
    );

    // So current theme now:
    this.currentTheme.value = nextTheme;

    //set a store function on login which sets the current session
    //if anyone tries to access another user login that is not currently authenticated -- block
    //save authenticated sessions
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 36px;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
}

.login-view {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  gap: 36px;
}

.login-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.login-image {
  width: 50vw;
}

.p-password.p-inputwrapper {
  width: 100%;
}

input {
  width: 100%;
}
</style>
