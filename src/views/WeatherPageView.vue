<template>
  <div class="weather-page-view">
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <p>Loading weather data...</p>
    </div>

    <div v-else class="weather-info">
      <h1 class="summary">{{ summary || "No summary available" }}</h1>
      <img :src="iconSrc" alt="Weather icon" class="weather-icon" />
      <p class="formatted-date">{{ formattedDate }}</p>
      <h1 class="temperature">
        {{ temperature || "No temperature available" }}
        <span class="degree-symbol">&#176;</span>
      </h1>
      <div class="card">
        <div class="wind-info">
          <img
            class="icon"
            src="@/assets/weather-svg/barometer.svg"
            alt="Wind angle" />
          <span>{{ angle || "N/A" }}&deg;</span>
        </div>
        <div class="wind-info">
          <img
            class="icon"
            src="@/assets/weather-svg/wind.svg"
            alt="Wind speed" />
          <span>{{ speed || "N/A" }} m/s</span>
        </div>
        <div class="wind-info">
          <img
            class="icon"
            src="@/assets/weather-svg/compass.svg"
            alt="Wind direction" />
          <span>{{ dir || "N/A" }}</span>
        </div>
      </div>

      <div class="weather-button-group">
        <button class="weather-btn">Today</button>
        <button class="weather-btn">Next 7 Days</button>
      </div>

      <div class="container">
        <div v-for="(item, index) in hourly" :key="index" class="contain">
          <h2>{{ item.formattedTime || "N/A" }}</h2>
          <img :src="item.iconSrcHourly" alt="Hourly Weather Icon" />
          <h2>
            {{ item.temperature || "N/A" }}
            <span class="degree-symbol-hourly">&#176;</span>
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCountryWeatherStore } from "@/stores/countryStore";
import { computed, ref } from "vue";

const weatherStore = useCountryWeatherStore();

// State for loading indicator
const loading = ref(true);

// Get weather data
const weatherIconId = computed(
  () => weatherStore.weatherData?.current?.icon_num || 0
);
const weatherIconFileName = computed(() =>
  weatherStore.getWeatherIconById(weatherIconId.value)
);

// Weather data
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
const angle = computed(() => wind.value.angle);
const dir = computed(() => wind.value.dir);
const speed = computed(() => wind.value.speed);

// Simulate data fetching delay for better UX
setTimeout(() => {
  loading.value = false;
}, 1000); // This would be removed when the actual API data is available
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100%;
  font-family: "Poppins", sans-serif;
  background: #f0f4f8; /* Soft light background */
  color: #333;
}

.weather-page-view {
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.6); /* Glass effect */
  backdrop-filter: blur(10px); /* Frosted glass effect */
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  margin: auto;
  transition: background-color 0.3s ease;
}

/* Loading state */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--wx-loading);
  font-size: 1.5em;
  font-weight: bold;
}

/* Weather Info */
.weather-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.summary {
  font-size: 2.5em;
  color: var(--wx-text-primary);
  font-weight: 600;
}

.weather-icon {
  width: 260px;
  height: 260px;
  margin: 10px 0;
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

/* Wind Info */
.card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 15px;
  margin-bottom: 40px;
}

.wind-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wind-info .icon {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}

.wind-info span {
  font-size: 1.1em;
  font-weight: 500;
  color: var(--wx-text-muted);
}
.weather-button-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 40px;
  max-width: 400px;
  margin-bottom: 0px;
  gap: 30px;
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
  margin-top: 35px; /* Added margin-top */
  margin-bottom: 30px;
}

.contain {
  flex: 0 0 auto;
  width: 140px; /* Slightly wider for better spacing */
  min-width: 140px;
  background: rgba(255, 255, 255, 0.85); /* Softer glass feel */
  border: 1px solid rgba(0, 0, 0, 0.05); /* Lighter border */
  text-align: center;
  border-radius: 12px; /* Smoother corners */
  padding: 10px; /* Balanced padding */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-right: 14px; /* Tighter spacing */
}

/* Scrollbar improvements */
.container::-webkit-scrollbar {
  height: 6px;
}

.container::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #e94e77, #f4a261); /* Gradient thumb */
  border-radius: 10px;
}

/* Hover effect refinement */
.contain:hover {
  transform: translateY(-5px); /* More noticeable lift */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Heading styling */
.contain h2 {
  font-size: 1em;
  color: var(--wx-text-secondary);
  letter-spacing: 0.5px; /* Improved readability */
}

/* Icon styling */
.contain img {
  width: 65px;
  height: 65px;
  margin: 8px 0; /* More balanced spacing */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)); /* Soft icon shadow */
}

/* Last heading pop effect */
.contain h2:last-child {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--wx-accent);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Slight glow */
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .weather-info {
    padding: 15px;
  }

  .summary {
    font-size: 2em;
  }

  .temperature {
    font-size: 3em;
  }

  .card {
    grid-template-columns: 1fr;
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
</style>
