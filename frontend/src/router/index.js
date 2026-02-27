import { createRouter, createWebHistory } from "vue-router";
// 기존 임포트 유지
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import list from "../views/list/list.vue";
import work from "../views/work/work.vue";
import Home from "../views/Home.vue";

// 파일 구조에 맞게 임포트 추가
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
  // 아이디 찾기 경로 추가
  {
    path: "/find-id",
    name: "FindId",
    component: FindId,
  },
  // 비밀번호 찾기(재설정)
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
    redirect: "/list/supported",
    children: [
      {
        path: "list",
        redirect: "/list/supported",
      },
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
      {
        path: "look",
        component: () => import("../views/list/manager_lookList.vue"),
      },
      {
        path: "center",
        component: () => import("../views/list/centerList.vue"),
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
