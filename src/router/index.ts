import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CharityLayout from "../components/CharityLayout.vue";
import DonationsLayout from "../components/DonationsLayout.vue";
import NewCasePage from "../views/NewCasePage.vue";

const requireLogin = (to, from, next) => {
  //console.log(from)
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
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/donor",
      component: HomeView,
      beforeEnter: requireLogin,
      redirect: "/donor/charities",
      children: [
        {
          path: "charities",
          component: CharityLayout,
        },
        {
          path: "donations",
          component: DonationsLayout,
        },
      ],
    },
    {
      path: "/beneficiary",
      component: HomeView,
      beforeEnter: requireLogin,
      redirect: "/beneficiary/requests",
      children: [
        {
          path: "dashboard",
          component: CharityLayout,
        },
        {
          path: "requests",
          component: DonationsLayout,
        },
        {
          path: "newcase",
          component: NewCasePage,
        },
      ],
    },

    {
      path: "/",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue"),
    },
  ],
});

export default router;
