<template>
  <div>
    <h1>weather-page</h1>
    <WeatherPage />
    <i class="wi wi-day-sunny"></i>
    <h1>{{ weatherStore.current }}</h1>
  </div>
</template>

<script setup>
import WeatherPage from "@/components/WeatherPage.vue";
import { useCountryWeatherStore } from "@/stores/countryStore";
import { computed } from "vue";

const weatherStore = useCountryWeatherStore();
const weatherData = computed(() => weatherStore.weatherData);
console.log(weatherData);
</script>

<style scoped>
.weather-icon {
  font-size: 48px;
  color: orange;
}
</style>
