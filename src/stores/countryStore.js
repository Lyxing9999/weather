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
  const isLocationAccessRequested = ref(false);

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
      sections: "all",
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
        isLocationAccessRequested.value = false;
      },
      (error) => {
        alert(
          "Location access denied. Please allow access to get weather data."
        );
        console.error("Error getting location:", error);
        locationDenied.value = true;
      }
    );
  }
  const mapWeatherIcon = {
    1: "not-available.svg", // Not available
    2: "clear-day.svg", // Sunny
    3: "partly-cloudy-day.svg", // Mostly sunny
    4: "partly-cloudy-day.svg", // Partly sunny
    5: "cloudy.svg", // Mostly cloudy
    6: "cloudy.svg", // Cloudy
    7: "overcast-day.svg", // Overcast
    8: "overcast-low-clouds.svg", // Overcast with low clouds
    9: "fog-day.svg", // Fog
    10: "rain.svg", // Light rain
    11: "rain.svg", // Rain
    12: "possible-rain.svg", // Possible rain
    13: "rain-shower.svg", // Rain shower
    14: "thunderstorms-day.svg", // Thunderstorm
    15: "local-thunderstorms-day.svg", // Local thunderstorms
    16: "snowflake.svg", // Light snow
    17: "snow.svg", // Snow
    18: "possible-snow.svg", // Possible snow
    19: "snow-shower.svg", // Snow shower
    20: "rain-and-snow.svg", // Rain and snow
    21: "possible-rain-and-snow.svg", // Possible rain and snow
    22: "rain-and-snow.svg", // Rain and snow
    23: "freezing-rain.svg", // Freezing rain
    24: "possible-freezing-rain.svg", // Possible freezing rain
    25: "hail.svg", // Hail
    26: "clear-night.svg", // Clear (night)
    27: "partly-cloudy-night.svg", // Mostly clear (night)
    28: "partly-cloudy-night.svg", // Partly clear (night)
    29: "overcast-night.svg", // Mostly cloudy (night)
    30: "overcast-night.svg", // Cloudy (night) (same icon as 29)
    31: "overcast-low-clouds-night.svg", // Overcast with low clouds (night)
    32: "rain-shower-night.svg", // Rain shower (night)
    33: "local-thunderstorms-night.svg", // Local thunderstorms (night)
    34: "snow-shower-night.svg", // Snow shower (night)
    35: "rain-and-snow-night.svg", // Rain and snow (night)
    36: "possible-freezing-rain-night.svg", // Possible freezing rain (night)
  };

  function getWeatherIconById(iconId) {
    return mapWeatherIcon[iconId] || "not-available.svg";
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
    isLocationAccessRequested,
    getWeatherIconById,
  };
});
