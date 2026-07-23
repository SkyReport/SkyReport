import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";
import { useAuthStore } from "../stores/authStore";

const routes = [
  {
    path: "/",
    name: "public-page",
    component: () => import("../publicPage.vue"),
  },
  {
    path: "/success",
    name: "public-success",
    component: () => import("../publicSuccess.vue"),
  },
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("../adminLogin.vue"),
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: { name: "admin-survey-management" },
      },
      {
        path: "management",
        name: "admin-survey-management",
        component: () => import("../adminSurveyManagement.vue"),
        meta: { title: "Survey Data" },
      },
      {
        path: "buat-survey/:id?",
        name: "admin-buat-survey",
        component: () => import("../adminBuatSurvey.vue"),
        meta: { title: "Buat Survey" },
      },
      {
        path: "report",
        name: "admin-report",
        component: () => import("../adminReport.vue"),
        meta: { title: "Laporan" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (!to.matched.some((record) => record.meta.requiresAdmin)) return true;

  const authStore = useAuthStore();
  if (!authStore.ready) {
    await authStore.restoreSession();
  }

  if (!authStore.isAdmin) {
    return { name: "admin-login" };
  }

  return true;
});

export default router;
