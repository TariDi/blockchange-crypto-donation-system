<template>
  <p-card class="login">
    <template #title>Login</template>
    <template #content>
      <p-tab-view>
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
                @click="attemptLoginDonor"
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
                @click="attemptLoginBeneficiary"
              />
            </div>
          </div>
        </p-tab-panel>
      </p-tab-view>
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

  store = useCryptoStore();

  async attemptLoginDonor() {
    this.submitLoading = true;
    await this.authenticate().then((result) => {
      this.$router.push("/donor");
    });
    this.submitLoading = false;
    this.store.initialize();

    this.store.setDonorAccount(true);
    await this.store.getAccounts();
    console.log(this.store.accountId);
    //await this.store.getBalance()
  }

  async attemptLoginBeneficiary() {
    this.submitLoading = true;
    await this.authenticate().then((result) => {
      this.$router.push("/beneficiary");
    });

    this.store.setDonorAccount(false);
    await this.store.getAccounts();
    console.log(this.store.accountId);
    this.submitLoading = false;
  }

  async authenticate() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.submitLoading = false;
        resolve(true);
      }, 2000); // Adjust the timeout duration as needed
    });
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
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
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

.p-password.p-inputwrapper {
  width: 100%;
}

input {
  width: 100%;
}
</style>
