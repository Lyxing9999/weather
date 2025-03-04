import { createWebHistory, createRouter } from "vue-router";
import CountrySelectView from "@/views/CountrySelectView.vue";
import WeatherPageView from "@/views/WeatherPageView.vue";

const routes = [
  {
    path: "/",
    name: "CountrySelect",
    component: CountrySelectView,
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
