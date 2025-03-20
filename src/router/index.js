import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/country-select",
    name: "CountrySelect",
    component: () => import("@/components/CountrySelect.vue"),
  },

  {
    path: "/weather",
    name: "WeatherPage",
    component: () => import("@/components/WeatherPage.vue"),
  },
  {
    path: "/next7Days",
    name: "Next7Days",
    component: () => import("@/components/Next7Days.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
});
export default router;
