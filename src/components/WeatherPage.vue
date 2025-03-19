<template>
  <Transition name="loading">
    <div v-if="loading" class="loading">
      <div>Weather loading</div>
      <img class="loading-svg" src="@/assets/Loading.svg" alt="" />
    </div>
  </Transition>

  <!-- CountrySelect component only renders when isCountrySelectVisible is true -->
  <Transition name="slide-fade">
    <div class="country-select" v-if="isCountrySelectVisible">
      <CountrySelect
        :key="isCountrySelectVisible"
        @goBack="toggleCountrySelect" />
    </div>
  </Transition>

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

        <h1 class="summary">{{ summary || "No summary available" }}</h1>
        <img :src="iconSrc" alt="Weather icon" class="weather-icon" />
        <p class="formatted-date">{{ formattedDate }}</p>
        <h1 class="temperature">
          {{ temperature || "No temperature available" }}
          <span class="degree-symbol">&#176;</span>
        </h1>
        <div class="weather-info-card">
          <WeatherInfoCard :angle="angle" :speed="speed" :dir="dir" />
        </div>
        <div class="weather-button-group">
          <button @click="goTo7DayForecast" class="weather-btn-7days">
            Next 7 Days
          </button>
        </div>
        <div class="container">
          <div v-for="daily in hourly" :key="daily.id" class="contain">
            <h2>{{ daily.formattedTime || "N/A" }}</h2>
            <img :src="daily.iconSrcHourly" alt="Hourly Weather Icon" />
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
import { computed, ref } from "vue";
import router from "@/router";
import WeatherInfoCard from "@/components/WeatherInfoCard.vue";
import CountrySelect from "./CountrySelect.vue";

const weatherStore = useCountryWeatherStore();
const loading = ref(true);
const isCountrySelectVisible = ref(false);

setTimeout(() => {
  loading.value = false;
}, 1000);

const toggleCountrySelect = () => {
  weatherStore.isLocationAccessRequested = false;
  isCountrySelectVisible.value = !isCountrySelectVisible.value;
};
const locationHeadingClickHandler = () => {
  isCountrySelectVisible.value = !isCountrySelectVisible.value;
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
      hour: "2-digit",
      minute: "2-digit",
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

function goTo7DayForecast() {
  router.push("Next7Days");
}
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "Poppins", sans-serif;
  background: var(--background-color);
  color: var(--wx-text-muted);
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
}

.city-heading {
  font-size: 2rem;
  color: var(--wx-text-primary);
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.country-heading {
  font-size: 1.25rem;
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
.country-heading:hover .location-svg {
  transform: scale(1.1);
}

.weather-icon {
  width: 250px;
  height: 250px;
  margin: 20px 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
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
  z-index: 99;
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
  font-size: 4em;
  font-weight: bold;
  color: var(--wx-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-button-group {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 40px;
  max-width: 400px;
  margin-bottom: 0px;
}
button {
  font-size: 0.8em;
  width: 150px;
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

.weather-btn-7days {
  border: none;
  background-color: transparent;
  font-weight: bold;
}

.contain {
  flex: 0 0 auto;
  width: 140px;
  min-width: 140px;
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

/* Mobile Responsive */
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
    font-size: 2em;
  }

  .temperature {
    font-size: 3em;
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
    padding: 6px;
  }
}

.weather-page-enter-active,
.weather-pgage-leave-active {
  transition:
    opacity 0.7s ease-in,
    transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: opacity, transform;
}

.weather-page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}

.weather-page-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

.weather-forecast-enter-active,
.weather-forecast-leave-active {
  transition:
    opacity 1.5s ease-out,
    transform 1.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: opacity, transform;
}

.weather-forecast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}

.weather-forecast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -100%);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>
