const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
  },
  {
    path: "/country-select",
    name: "CountrySelect",
    component: () =>
      import(
        /* webpackChunkName: "country-select" */ "@/components/CountrySelect.vue"
      ),
  },
  {
    path: "/weather",
    name: "WeatherPage",
    component: () =>
      import(
        /* webpackChunkName: "weather-page" */ "@/components/WeatherPage.vue"
      ),
  },
  {
    path: "/next7Days",
    name: "Next7Days",
    component: () =>
      import(/* webpackChunkName: "next7days" */ "@/components/Next7Days.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];
