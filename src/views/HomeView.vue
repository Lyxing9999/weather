<template>
  <div class="full-screen">
    <!-- animation background -->
    <div id="animation-bg" class="animation-bg"></div>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCountryWeatherStore } from "@/stores/countryStore";
import { useRouter } from "vue-router";
import lottie from "lottie-web";
import animationData from "@/assets/Animation-BG.json";

// Reactive state and stores
const weatherStore = useCountryWeatherStore();
const router = useRouter();

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
onMounted(() => {
  lottie.loadAnimation({
    container: document.getElementById("animation-bg"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: animationData,
  });
});
</script>
<style>
.full-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-image: var(--background-color);
  text-align: center;
  position: relative;
  overflow: hidden;
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
  z-index: 999;
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
    max-width: 70%;
    top: 25%;
  }
  .option-button {
    width: 100%;
    padding: 14px 30px;
    font-size: 1.1rem;
  }
  .option-button-toggle:hover {
    background-color: #ffffff;
    color: var(--secondary-color-hover);
  }
  .location-denied-message {
    font-size: 1rem;
  }
  .location-denied-message button {
    font-size: 0.9rem;
  }
}
</style>
