import { createWebHistory, createRouter } from "vue-router";
import CountrySelect from "@/components/CountrySelect.vue";
import HomeView from "@/views/HomeView.vue";
import WeatherPage from "@/components/WeatherPage.vue";
import Next7Days from "@/components/Next7Days.vue";
const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomeView,
  },
  {
    path: "/country-select",
    name: "CountrySelect",
    component: CountrySelect,
  },

  {
    path: "/weather",
    name: "WeatherPage",
    component: WeatherPage,
  },
  {
    path: "/Next7Days",
    name: "Next7Days",
    component: Next7Days,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
