import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import list from "../views/list/list.vue";
import work from "../views/work/work.vue";
import Home from "../views/Home.vue";
import FindId from "../views/FindId.vue";
import findpw from "../views/findpw.vue";
import Mypage from "../views/mypage/mypage.vue";

const routes = [
  {
    path: "/",
    redirect: "/sign-in",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/find-id",
    name: "FindId",
    component: FindId,
  },
  {
    path: "/find-pw",
    name: "FindPw",
    component: findpw,
  },
  {
    path: "/work",
    name: "work",
    component: work,
    children: [
      {
        path: "plan",
        components: { right: () => import("../views/work/plan_manager.vue") },
      },
      {
        path: "priority",
        components: {
          right: () => import("../views/work/priority_manager.vue"),
        },
      },
      {
        path: "record",
        components: { right: () => import("../views/work/record.vue") },
      },
      {
        path: "result",
        components: { right: () => import("../views/work/result.vue") },
      },
      {
        path: "representative",
        components: { right: () => import("../views/work/representative.vue") },
      },
    ],
  },
  {
    path: "/list",
    name: "List",
    component: list,
    redirect: "/list/supported",
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
      {
        path: "form",
        component: () => import("../views/form/formList.vue"),
      },
      {
        path: "look",
        component: () => import("../views/list/manager_lookList.vue"),
      },
      {
        path: "center",
        component: () => import("../views/list/centerList.vue"),
      },
      {
        path: "allotment",
        component: () => import("../views/list/allotmentList.vue"),
      },
      {
        path: "appreq",
        component: () => import("../views/list/appReqList.vue"),
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
  {
    path: "/form",
    name: "Form",
    component: list,
    children: [
      {
        path: "write",
        component: () => import("../views/form/formWrite.vue"),
      },
      {
        path: "view/:num",
        component: () => import("../views/form/formView.vue"),
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
  {
    path: "/reset-password",
    name: "resetPW",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/mypage",
    component: Mypage,
    children: [
      {
        path: "supported",
        component: () => import("../views/mypage/supportedPage.vue"),
      },
      {
        path: "info",
        component: () => import("../views/mypage/mypageInfo.vue"),
      },
    ],
  },
  /*
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
  },
  */
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
