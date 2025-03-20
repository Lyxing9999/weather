<template>
  <!-- animation background -->
  <div ref="animationContainer" class="animation-bg"><LottieAnimation /></div>
  <Transition name="home-view" appear>
    <div v-if="!loading" class="full-screen">
      <!-- Buttons only render when isCountrySelectVisible is false -->
      <div v-if="!isCountrySelectVisible" class="buttons">
        <button class="option-button-toggle" @click="toggleCountrySelect">
          Select Country
        </button>
        <button class="option-button-get-weather" @click="getWeatherData">
          <span v-if="weatherStore.loading" class="loading-text">
            <div class="loader"></div>
            Loading...
          </span>
          <span v-else>View Forecast</span>
        </button>
        <div
          v-if="weatherStore.isLocationAccessRequested"
          class="location-denied-message">
          <p>Please allow location access to get the weather information.</p>
          <button @click="getWeatherData">Retry</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCountryWeatherStore } from "@/stores/countryStore";
import { useRouter } from "vue-router";
import LottieAnimation from "@/components/LottieAnimation.vue";
// Reactive state and stores
const weatherStore = useCountryWeatherStore();
const router = useRouter();
const loading = ref(true);
const isCountrySelectVisible = ref(false);
// Toggle the visibility of the country select component
const toggleCountrySelect = () => {
  weatherStore.isLocationAccessRequested = false;
  isCountrySelectVisible.value = !isCountrySelectVisible.value;
  router.push("/country-select");
};

// Weather data based on locations
const getWeatherData = async () => {
  weatherStore.placeId = null;
  weatherStore.weatherCountry = null;
  weatherStore.weatherCity = null;

  try {
    weatherStore.isLocationAccessRequested = false;
    await weatherStore.getCurrentLocation();
    if (weatherStore.locationDenied) {
      weatherStore.isLocationAccessRequested = true;
    } else {
      weatherStore.isLocationAccessRequested = false;
      await weatherStore.getWeatherData();
      if (weatherStore.isWeatherApiSuccessful) {
        router.push({ path: "/weather" });
      }
    }
  } catch (error) {
    alert("Error fetching weather data:", error);
  }
};

onMounted(async () => {
  await weatherStore.getCurrentLocation();
});

setTimeout(() => {
  loading.value = false;
}, 100);
</script>
<style scoped>
.full-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.animation-bg {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: 90%;
  z-index: 0;
}

.buttons {
  display: flex;
  gap: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 300px;
  width: 100%;
  max-width: 600px;
}

.option-button-toggle,
.option-button-get-weather {
  background-color: #ffffff;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  border-radius: 7px;
  padding: 14px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.28s ease;
  width: 200px;

  box-shadow: var(--box-shadow);
  text-transform: uppercase;
  font-weight: 500;
}

.option-button-toggle:hover {
  background-color: var(--secondary-color);
  color: #ffffff;
  transform: translateY(-2.5px);
}

.option-button-get-weather {
  background-color: var(--secondary-color);
  color: #ffffff;
}

.option-button-get-weather:hover {
  background-color: var(--secondary-color-hover);
  transform: translateY(-2.5px);
}

.location-denied-message {
  background-color: #ffcccc;
  padding: 5px;
  text-align: center;
  border: 1px solid #ff0000;
  border-radius: 7px;
}

.location-denied-message button {
  background-color: #ff0000;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading-enter-active,
.loading-leave-active {
  transition:
    opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.home-view-enter-active {
  transition: all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.home-view-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-view-enter-from,
.home-view-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.buttons {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-button-toggle,
.option-button-get-weather {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.option-button-toggle:before,
.option-button-get-weather:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.option-button-toggle:hover,
.option-button-get-weather:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.option-button-toggle:hover:before,
.option-button-get-weather:hover:before {
  left: 100%;
}

.option-button-toggle:active,
.option-button-get-weather:active {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading > div {
  margin-bottom: 20px;
  font-size: 24px;
  animation: pulse 3s infinite;
}

.loading-svg {
  animation: floatAnimation 1s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes floatAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 500px) {
  .full-screen {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .buttons {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    top: 25%;
  }

  .option-button-toggle,
  .option-button-get-weather {
    width: 80%;
    padding: 1em;
    font-size: 1rem;
  }
  .option-button {
    width: 100%;
    padding: 14px 30px;
    font-size: 1.1rem;
  }

  .location-denied-message {
    font-size: 1rem;
  }

  .location-denied-message button {
    font-size: 0.9rem;
  }
}
</style>
