<template>
  <Transition name="loading" appear>
    <div v-if="loading" class="loading">
      <div>Weather loading</div>
      <img
        class="loading-svg"
        src="@/assets/Loading.svg"
        alt="Loading animations" />
    </div>
  </Transition>

  <Transition name="weather-forecast">
    <div v-if="!loading" class="weekly-forecast-view">
      <h1 class="weekly-title">7-Day Weather Forecast</h1>
      <div class="weekly-container">
        <div v-for="(day, index) in weeklyData" :key="index" class="day-card">
          <h2 class="day-name">{{ day.dayName }}</h2>
          <img v-lazy="day.iconSrc" alt="Weather icon" class="day-icon" />
          <h3 class="day-temp">
            {{ day.temp }} <span class="degree-symbol-hourly">&#176;</span>
          </h3>
          <p class="day-summary">{{ day.summary }}</p>
        </div>
      </div>
      <div class="back-button-container">
        <button @click="goBack" class="back-button">Back</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCountryWeatherStore } from "@/stores/countryStore";
import { computed, ref } from "vue";

const weatherStore = useCountryWeatherStore();
const loading = ref(true);
setTimeout(() => {
  loading.value = false;
}, 600);

const weeklyData = computed(() => {
  if (
    weatherStore.weatherData?.daily?.data &&
    Array.isArray(weatherStore.weatherData.daily.data)
  ) {
    return weatherStore.weatherData.daily.data.map((item) => {
      const day = item?.day;
      const allDay = item?.all_day;
      const summary = item?.summary;
      const icon = item?.icon;

      if (!day || !allDay || !summary || !icon) {
        console.warn("Missing data for a day:", item);
        return {
          dayName: "N/A",
          temp: "N/A",
          summary: "Data missing",
          iconSrc: require("@/assets/weather-svg/not-available.svg"),
        };
      }

      const date = new Date(day);
      const options = { weekday: "long" };

      let tempValue = allDay?.temperature_max;
      if (
        allDay?.temperature_min !== null &&
        allDay?.temperature_min !== undefined
      ) {
        tempValue = (allDay?.temperature_max + allDay?.temperature_min) / 2;
      }

      return {
        dayName: date.toLocaleDateString(undefined, options),
        temp: Math.round(tempValue),
        summary: summary,
        iconSrc: require(
          `@/assets/weather-svg/${weatherStore.getWeatherIconById(icon)}`
        ),
      };
    });
  } else {
    console.error(
      "Daily weather data is missing or invalid:",
      weatherStore.weatherData?.daily
    );
    return [];
  }
});

const goBack = () => {
  window.history.back();
};
</script>

<style>
.weather-forecast-enter-active {
  transition: all 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.weather-forecast-leave-active {
  transition: all 0.6s ease-out;
  will-change: opacity, transform;
}

.weather-forecast-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.weather-forecast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.01);
}

.weekly-forecast-view {
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  margin: auto;
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
}

.weekly-title {
  font-size: 2em;
  color: var(--wx-text-primary);
  text-align: center;
  margin-bottom: 2em;
}

.weekly-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 3em;
}

.day-card {
  width: 180px;
  background: var(--background-color);
  border-radius: 12px;
  text-align: center;
  padding: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.day-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.day-name {
  font-size: 1.2em;
  color: var(--wx-text-secondary);
  font-weight: bold;
}

.day-icon {
  width: 100px;
  height: 100px;
  margin: 5px 0;
}

.day-temp {
  font-size: 1.4em;
  font-weight: bold;
  color: var(--wx-accent);
}

.day-summary {
  font-size: 0.5em;
  color: var(--wx-text-muted);
  margin-top: 5px;
}

.back-button-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.back-button {
  margin-bottom: 50px;
  color: #fff;
  font-weight: 600;
  background-color: var(--secondary-color-hover);
  border: 2px solid var(--secondary-color);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.back-button:hover {
  color: var(--secondary-color-hover);
  background-color: #fff;
}

.back-button:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}
.back-button:hover {
  color: #fff;
  background-color: var(--secondary-color-hover);
}

.back-button:hover:before {
  left: 100%;
}

.back-button:active {
  transform: scale(1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .day-card {
    width: 140px;
    padding: 8px;
  }
  .day-name {
    font-size: 1em;
  }
  .day-temp {
    font-size: 1.2em;
  }
  .weekly-title {
    font-size: 1.7em;
  }
  .back-button {
    font-size: 0.75rem;
    width: 118px;
  }
  .back-button {
    margin-bottom: 35px;
  }
}
</style>
