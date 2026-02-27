import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import list from "../views/list/list.vue";
import work from "../views/work/work.vue";
import Home from "../views/Home.vue";
import FindId from "../views/FindId.vue";
import findpw from "../views/findpw.vue";

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
        components: { right: () => import("../views/work/plan.vue") },
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
      {
        path: "login",
        components: { right: () => import("../views/login/login.vue") },
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
        path: "add",
        component: () => import("../views/list/supportedAdd.vue"),
      },
      {
        path: "document",
        component: () => import("../views/list/documentLIST.vue"),
      },
    ],
  },
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
