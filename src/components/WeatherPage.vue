<template>
  <!-- laoding -->
  <Transition name="loading" appear>
    <div v-if="loading" class="loading">
      <div>Weather loading</div>
      <img
        class="loading-svg"
        src="@/assets/Loading.svg"
        alt="loading animation" />
    </div>
  </Transition>

  <!-- weather page show -->
  <Transition name="weather-page">
    <div v-if="!loading" class="weather-page-view">
      <div class="weather-info">
        <div class="location-heading" @click="locationHeadingClickHandler">
          <h2 v-if="weatherStore.weatherCity" class="city-heading">
            {{ weatherStore.weatherCity }}
          </h2>
          <h3 v-if="weatherStore.weatherCountry" class="country-heading">
            {{ weatherStore.weatherCountry }}
            <img
              class="location-svg"
              src="@/assets/location.svg"
              alt="Location icon" />
          </h3>
        </div>
        <!-- weather info -->
        <h1 class="summary">{{ summary || "No summary available" }}</h1>
        <img v-lazy="iconSrc" alt="Weather icon" class="weather-icon" />
        <p class="formatted-date">{{ formattedDate }}</p>
        <h1 class="temperature">
          {{ temperature || "No temperature available" }}
          <span class="degree-symbol">&#176;</span>
        </h1>
        <!-- weather info card component -->
        <div class="weather-info-card">
          <WeatherInfoCard :angle="angle" :speed="speed" :dir="dir" />
        </div>
        <!-- Button Navigation -->
        <div class="weather-button-group">
          <button class="btn-back-home-page" @click="goBackHomePage">
            Back
          </button>
          <button @click="goTo7DayForecast" class="weather-btn-7days">
            Next 7 Days
          </button>
        </div>
        <!-- Hourly Forecast -->
        <div class="container">
          <div v-for="daily in hourly" :key="daily.id" class="contain">
            <h2>{{ daily.formattedTime || "N/A" }}</h2>
            <img v-lazy="daily.iconSrcHourly" alt="Hourly Weather Icon" />
            <h2>
              {{ daily.temperature || "N/A" }}
              <span class="degree-symbol-hourly">&#176;</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCountryWeatherStore } from "@/stores/countryStore";
import { computed, ref, onMounted } from "vue";
import router from "@/router";
import WeatherInfoCard from "@/components/WeatherInfoCard.vue";

const weatherStore = useCountryWeatherStore();
const loading = ref(true);
const isCountrySelectVisible = ref(false);
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 600);
});
const locationHeadingClickHandler = () => {
  isCountrySelectVisible.value = !isCountrySelectVisible.value;
  router.push("/country-select");
};

// Get weather data
const weatherIconId = computed(
  () => weatherStore.weatherData?.current?.icon_num || 0
);
const weatherIconFileName = computed(() =>
  weatherStore.getWeatherIconById(weatherIconId.value)
);
const iconSrc = computed(() =>
  require(`@/assets/weather-svg/${weatherIconFileName.value}`)
);
const summary = computed(
  () => weatherStore.weatherData?.current?.summary || "No current available"
);
const temperature = computed(
  () =>
    weatherStore.weatherData?.current?.temperature || "No temperature available"
);
const rawDate = computed(
  () =>
    weatherStore.weatherData?.hourly?.data[0]?.date || "No current available"
);
// hourly formatting
const hourly = computed(() => {
  return (
    weatherStore.weatherData?.hourly?.data?.map((item) => {
      const date = new Date(item?.date || "");
      let hours = date.getHours();
      const AmPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return {
        ...item,
        formattedTime: `${hours} ${AmPm}`,
        iconSrcHourly: require(
          `@/assets/weather-svg/${weatherStore.getWeatherIconById(item?.icon || 0)}`
        ),
      };
    }) || []
  );
});

// Date formatting
const formattedDate = computed(() => {
  if (rawDate.value) {
    const dateObj = new Date(rawDate.value);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return dateObj.toLocaleDateString(undefined, options);
  } else {
    return "No date available";
  }
});

// Wind data
const wind = computed(() => weatherStore.weatherData?.current?.wind || {});
const angle = computed(() => wind.value?.angle);
const dir = computed(() => wind.value?.dir);
const speed = computed(() => wind.value?.speed);

function goBackHomePage() {
  router.push("/");
}
function goTo7DayForecast() {
  router.push("Next7Days");
}
</script>
<style>
.weather-page-enter-active {
  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.weather-page-leave-active {
  transition: all 0.3s ease-out;
  will-change: opacity, transform;
}

.weather-page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.weather-page-leave-to {
  opacity: 0;
}

.loading-enter-active {
  transition: all 0.3s ease-out;
}

.loading-leave-active {
  transition: all 0.1s ease-in;
  position: absolute;
  width: 100%;
}

.loading-enter-from {
  opacity: 0;
}

.loading-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.weather-page-view {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.loading {
  width: 80%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100%;
  color: var(--wx-loading);
  font-size: 1.5em;
  font-weight: bold;
  margin: auto;
  z-index: 10000;
}

.loading-svg {
  width: 55px;
  height: auto;
  transform: translateZ(0);
  background-color: transparent;
}
.weather-page-view {
  width: 100%;
  max-width: 1200px;
  background: var(--blur-bg);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 20px;
  margin: auto;
  transition: background-color 0.3s ease;
}
.country-select {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 10;
}
.location-heading {
  text-align: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.city-heading {
  font-size: 2.25rem;
  color: var(--wx-text-primary);
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.country-heading {
  font-size: 1.5rem;
  color: var(--wx-text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 400;
}

.location-svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}
.country-heading:hover .location-svg.city-heading {
  transform: scale(1.2);
}

.weather-icon {
  width: 250px;
  height: 250px;
  margin: 20px 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.summary {
  font-size: 2.5em;
  color: var(--wx-text-secondary);
  font-weight: 600;
}

.formatted-date {
  color: var(--wx-text-secondary);
  margin-bottom: 10px;
  font-size: 1.2em;
}

.temperature {
  font-size: 3em;
  font-weight: bold;
  color: var(--wx-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-button-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 100px;
  max-width: 500px;
  margin-bottom: 0px;
}
.weather-btn-7days,
.btn-back-home-page {
  border: none;
  font-weight: 600;
  background-color: transparent;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.weather-btn-7days {
  width: 160px;
}
.btn-back-home-page {
  width: 130px;
}

.weather-btn-7days:before,
.btn-back-home-page:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;

  background: rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.weather-btn-7days:hover,
.btn-back-home-page:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.weather-btn-7days:hover:before,
.btn-back-home-page:hover:before {
  left: 100%;
}

.weather-btn-7days:active,
.btn-back-home-page:active {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 10px;
  gap: 10px;
  width: 100%;
  max-width: 100%;
  scroll-behavior: smooth;
  margin-top: 35px;
  margin-bottom: 30px;
}

.contain {
  flex: 0 0 auto;
  width: 140px;
  background: var(--background-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-right: 14px;
  margin-bottom: 0.5em;
}

.container::-webkit-scrollbar {
  height: 6px;
  margin-top: 1em;
}

.container::-webkit-scrollbar-thumb {
  width: 40%;
  background: var(--primary-gradient);
  border-radius: 10px;
}

.contain:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.contain h2 {
  font-size: 1em;
  color: var(--wx-text-secondary);
  letter-spacing: 0.5px;
}

.contain img {
  width: 65px;
  height: 65px;
  margin: 8px 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.contain h2:last-child {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--wx-accent);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .city-heading {
    font-size: 1.5rem;
  }

  .country-heading {
    font-size: 1rem;
    flex-wrap: wrap;
  }
  .loading {
    font-size: 0.3rem;
  }
  .weather-icon {
    width: 220px;
    height: 220px;
  }

  .weather-info {
    padding: 15px;
  }

  .summary {
    font-size: 1.5em;
  }

  .temperature {
    font-size: 2em;
  }
  .weather-btn-7days {
    font-size: 0.8rem;
    width: 150px;
  }
  .btn-back-home-page {
    font-size: 0.8rem;
    width: 120px;
  }

  .contain {
    width: 120px;
    padding: 10px;
  }

  .contain h2 {
    font-size: 0.9em;
  }
  .contain {
    width: 100px;
    padding: 6 px;
  }
  .loading-svg {
    width: 50px;
    height: auto;
  }
}
</style>
