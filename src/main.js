import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueLazyload from "vue-lazyload";
import "@/assets/styles.css";

const app = createApp(App);
app.use(createPinia()).use(router).use(VueLazyload).mount("#app");
