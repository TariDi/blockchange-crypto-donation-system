<template>
  <template v-if="store.refreshLoading">
  </template>
  <template v-else>
  <p-menu
    :model="menuItems"
    class="w-full h-full md:w-15rem border-none shadow-3"
  >
    <template #submenuheader="{ item }">
      <span class="text-teal-600 font-bold">{{ item.label }}</span>
    </template>
    <template #item="{ item, props }">
      <router-link v-if="item.route" :to="item.route" custom>
        <a v-ripple v-bind="props.action" @click="navigate(item.route)">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
    </template>
    <template #end>
      <p-button
        v-ripple
        class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround"
      >
        <p-avatar icon="pi pi-user" class="mr-2" shape="circle" />
        <span class="inline-flex flex-column">
          <span class="font-bold">{{ store.currentSession.username }}</span>
          <span class="text-sm">{{ accountType }}</span>
        </span>
      </p-button>
    </template>
  </p-menu>
</template>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import PMenu from "primevue/menu";
import { RouterLink } from "vue-router";
import PButton from "primevue/button";
import PAvatar from "primevue/avatar"
import { useCryptoStore } from '@/stores/crypto'

import { ref } from "vue";

@Component({
  components: {
    PMenu,
    RouterLink,
    PButton,
    PAvatar,
  },
})
export default class Navigation extends Vue {
  rootPath: string = ""
  store = useCryptoStore()

  items_d = ref([
    {
      label: "Navigation",
      items: [
        {
          label: "Home",
          icon: "pi pi-home",
          route: "charities",
        },
        {
          label: "Donations",
          icon: "pi pi-search",
          route: "donations",
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          route: "login",
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          route: "login",
        },
      ],
    },
    { separator: true },
  ]);

  items_b = ref([
    {
      label: "Navigation",
      items: [
        {
          label: "Open Cases",
          icon: "pi pi-home",
          route: "requests",
        },
        {
          label: "Create Case",
          icon: "pi pi-plus",
          route: "newcase",
        },
        // {
        //     label: 'All Cases',
        //     icon: 'pi pi-search',
        //     route: '/beneficiary/dashboard'
        // }
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          route: "login",
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          route: "login",
        },
      ],
    },
    { separator: true },
  ])

  mounted () {
    this.rootPath = window.location.pathname.split("/")[1]
    // console.log(this.$route.params)
  }

  get accountType() {
    return this.store.currentSession.donor? "Donor" : "Beneficiary"
  }

  get menuItems() {
    if (this.store.currentSession.donor) {
      return this.items_d
    }
    return this.items_b
  }

  navigate(to) {
    if(to === 'login'){
      this.store.flushCurrentSession()
      this.$router.push({name: "login"})
    }
    this.$router.push({name: to, params: {username: this.store.currentSession.username}})
  }
}
</script>

<style lang="scss" scoped></style>
