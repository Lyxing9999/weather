<template>
  <div class="full-screen">
    <div id="animation-bg" class="animation-bg"></div>

    <!-- CountrySelect component only renders when isShow is true -->

    <Transition name="slide-fade">
      <div class="country-select" v-if="isCountrySelectVisible">
        <CountrySelect
          :key="isCountrySelectVisible"
          @goBack="toggleCountrySelect" />
      </div>
    </Transition>

    <!-- Buttons only render when isShow is false -->

    <Transition name="fade-move">
      <div v-if="!isCountrySelectVisible" class="buttons">
        <button class="option-button-toggle" @click="toggleCountrySelect">
          Select Country
        </button>
        <button class="option-button-get-weather" @click="getWeatherData">
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
    </Transition>
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
.country-select {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
  top: 0; /* Start above the viewport */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
  z-index: 5;
}
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -100%); /* Start above screen */
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%); /* Exit downward */
}

.fade-move-leave-active {
  transition: all 0.1s ease-in;
}

.fade-move-enter-from {
  opacity: 0;
  transform: translateY(40px); /* Enter from below */
}

.fade-move-leave-to {
  opacity: 0;
  transform: translateY(10px); /* Exit downward */
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
  z-index: 9999;
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
  opacity: 0.8;
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

  .location-denied-message {
    font-size: 1rem;
  }

  .location-denied-message button {
    font-size: 0.9rem;
  }
}
</style>
