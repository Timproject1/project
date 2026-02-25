import { createRouter, createWebHistory } from "vue-router";
// import Dashboard from "../views/Dashboard.vue";
// import Tables from "../views/Tables.vue";
// import Billing from "../views/Billing.vue";
// import RTL from "../views/Rtl.vue";
// import Notifications from "../views/Notifications.vue";
// import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
// import SignUp from "../views/SignUp.vue";
import list from "../views/list/list.vue";
import SignUp from "../views/SignUp.vue";
import work from "../views/work/work.vue";
const routes = [
  {
    path: "/work",
    name: "work",
    component: work,
    children: [
      {
        path: "plan",
        components: {
          right: () => import("../views/work/plan.vue"),
        },
      },
      {
        path: "priority",
        components: {
          right: () => import("../views/work/priority_manager.vue"),
        },
      },
      {
        path: "record",
        components: {
          right: () => import("../views/work/record.vue"),
        },
      },
      {
        path: "result",
        components: {
          right: () => import("../views/work/result.vue"),
        },
      },
      {
        path: "representative",
        components: {
          right: () => import("../views/work/representative.vue"),
        },
      },
      {
        path: "login",
        components: {
          right: () => import("../views/login/login.vue"),
        },
      },
    ],
  },
  {
    path: "/list",
    name: "List",
    component: list,
    children: [
      {
        path: "supported",
        component: () => import("../views/list/supportedList.vue"),
      },
      {
        path: "info",
        component: () => import("../views/list/SupportedInfo.vue"),
      },
      {
        path: "document",
        component: () => import("../views/list/documentLIST.vue"),
      },
    ],
  },
  {
    path: "/document",
    name: "Document",
    component: list,
    children: [
      {
        path: "write",
        component: () => import("../views/document/write_document.vue"),
      },
    ],
  },

  // {
  //   path: "/",
  //   name: "/",
  //   redirect: "/dashboard",
  // },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   component: Dashboard,
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   component: Tables,
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   component: Billing,
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL",
  //   component: RTL,
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   component: Notifications,
  // },
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: Profile,
  // },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
