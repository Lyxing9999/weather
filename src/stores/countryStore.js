import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

//Country Store
export const useCountryWeatherStore = defineStore("weather", () => {
  const weatherData = ref(null);
  const locationDenied = ref(false);
  const placeId = ref(null);
  const lat = ref(null);
  const lon = ref(null);
  const isWeatherApiSuccessful = ref(false);
  const loading = ref(false);

  //URL
  const API_KEY = process.env.VUE_APP_API_KEY;
  const weatherUrl = "https://www.meteosource.com/api/v1/free/point";

  async function getWeatherData() {
    if (loading.value) return;
    weatherData.value = null;
    isWeatherApiSuccessful.value = false;
    if (!placeId.value && (!lat.value || !lon.value)) return;

    loading.value = true;
    const params = new URLSearchParams({
      sections: "current,hourly",
      language: "en",
      units: "auto",
      key: API_KEY,
    });

    if (placeId.value) {
      params.append("place_id", placeId.value);
    } else {
      params.append("lat", lat.value);
      params.append("lon", lon.value);
    }
    try {
      const response = await axios.get(`${weatherUrl}?${params.toString()}`);
      weatherData.value = response.data;
      isWeatherApiSuccessful.value = !!weatherData.value?.current;
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch weather data. Please try again later.");
    } finally {
      loading.value = false;
    }
  }

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      locationDenied.value = true;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude;
        lon.value = position.coords.longitude;
        placeId.value = null;
        locationDenied.value = false;
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Please enable location access to get the weather information.");
        locationDenied.value = true;
      }
    );
  }

  return {
    weatherData,
    getWeatherData,
    locationDenied,
    placeId,
    getCurrentLocation,
    isWeatherApiSuccessful,
    lat,
    lon,
    loading,
  };
});
