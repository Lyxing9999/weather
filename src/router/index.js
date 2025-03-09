import { createWebHistory, createRouter } from "vue-router";
import WeatherPageView from "@/views/WeatherPageView.vue";
import HomeView from "@/views/HomeView.vue";
const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomeView,
  },
  {
    path: "/weather",
    name: "WeatherPage",
    component: WeatherPageView,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
