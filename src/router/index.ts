import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CharityLayout from "../components/CharityLayout.vue";
import DonationsLayout from "../components/DonationsLayout.vue";
import NewCasePage from "../views/NewCasePage.vue"
import RequestsLayout from '../components/RequestsLayout.vue'
import { useCryptoStore } from "@/stores/crypto"

//const store = useCryptoStore()

const requireLogin = (to, from, next) => {
  // console.log(from)
  if (
    from.path === "/" ||
    from.path === "/donor" ||
    from.path === "/beneficiary"
  ) {
    // Check if the user is authenticated (you may need to adjust this)
    next(); // Allow access to the route
  } else {
    next("/"); // Redirect to the login page if not authenticated
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/donor/:username/",
      name: "donor",
      component: HomeView,
      beforeEnter: requireLogin,
      redirect: to => ({
        name: "charities",
        params: {username: to.params.username}
      }),
      children: [
        {
          path: "charities",
          name: "charities",
          component: CharityLayout,
        },
        {
          path: "donations",
          name: "donations",
          component: DonationsLayout,
        },
      ],
    },
    {
      path: "/beneficiary/:username/",
      name: "beneficiary",
      component: HomeView,
      beforeEnter: requireLogin,
      redirect: to => ({
        name: "requests",
        params: {username: to.params.username}
      }),
      props: true,
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: CharityLayout,
        },
        {
          path: "requests",
          name: "requests",
          component: RequestsLayout,
        },
        {
          path: "newcase",
          name: "newcase",
          component: NewCasePage,
        },
      ],
    },

    {
      path: "/",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue"),
    },
  ],
})

// router.beforeEach((to, from) => {
//   console.log(from)
//   // if(to.params === store.currentSession.username){
//   //   return true
//   // }
//   return false
// })


export default router;
