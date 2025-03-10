<template>
  <div class="full-screen">
    <div id="animation-bg" class="animation-bg"></div>
    <!-- CountrySelect component only renders when isShow is true -->
    <div class="country-select">
      <CountrySelect
        v-if="isCountrySelectVisible"
        @goBack="toggleCountrySelect" />
    </div>

    <!-- Buttons only render when isShow is false -->

    <div v-if="!isCountrySelectVisible" class="buttons">
      <button class="option-button" @click="toggleCountrySelect">
        Select Country
      </button>
      <button class="option-button" @click="getWeatherData">
        <span v-if="weatherStore.loading">Loading...</span>
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
import CountrySelect from "@/components/CountrySelect.vue";
import { ref, onMounted } from "vue";
import { useCountryWeatherStore } from "@/stores/countryStore";
import { useRouter } from "vue-router";
import lottie from "lottie-web";
import animationData from "@/assets/Animation-BG.json";

// Reactive state and stores
const weatherStore = useCountryWeatherStore();
const router = useRouter();
const isCountrySelectVisible = ref(false);
const isLocationAccessRequested = ref(false);

// Toggle the visibility of the country select component
const toggleCountrySelect = () => {
  isLocationAccessRequested.value = false;
  isCountrySelectVisible.value = !isCountrySelectVisible.value;
};

// Get weather data based on location availability
const getWeatherData = async () => {
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

onMounted(() => {
  weatherStore.getCurrentLocation();

  lottie.loadAnimation({
    container: document.getElementById("animation-bg"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: animationData,
  });
});
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  font-family: "Arial", sans-serif;
}
.full-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: var(--gradient-bg);
  text-align: center;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.animation-bg {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: 90%;
  z-index: 0;
}
.country-select {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
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
  z-index: 9999;
}

.option-button {
  background-color: #ffffff;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  border-radius: 8px;
  padding: 14px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 200px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  font-weight: 500;
}

.option-button:hover {
  background-color: var(--secondary-color);
  color: #ffffff;
  transform: translateY(-2.5px);
}

.option-button:active {
  transform: translateY(1px);
}

.option-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.6);
}

.option-button.active {
  background-color: #fda085;
  color: #ffffff;
}
.location-denied-message {
  background-color: #ffcccc;
  padding: 5px;

  text-align: center;
  border: 1px solid #ff0000;
  border-radius: 8px;
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
    width: 100%; /* Full width on small screens */
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
