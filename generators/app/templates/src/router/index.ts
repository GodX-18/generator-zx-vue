import {
  createRouter,
  // createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/home.vue";
import Layout from "@/layout/index.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Layout,
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: HomeView,
        },
      ],
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/error-page/404.vue"),
    },
  ],
});

export default router;
