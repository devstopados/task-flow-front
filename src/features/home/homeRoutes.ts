import type { RouteRecordRaw } from "vue-router";

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/features/home/pages/HomePage.vue"),
  },
];
