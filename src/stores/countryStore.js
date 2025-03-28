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
  const weatherCountry = ref(null);
  const weatherCity = ref(null);
  const errorMessage = ref("");

  //URL
  const API_KEY = process.env.VUE_APP_API_KEY;
  const WEATHER_URL = "https://www.meteosource.com/api/v1/free/point";
  const NEAREST_PLACE_URL =
    "https://www.meteosource.com/api/v1/free/nearest_place";

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
      await getCountryByLatLon();
    }
    loading.value = true;
    try {
      const response = await axios.get(`${WEATHER_URL}?${params.toString()}`);
      weatherData.value = response.data;
      isWeatherApiSuccessful.value = !!weatherData.value?.current;
      loading.value = false;
    } catch (error) {
      console.error("API Error:", error);
      errorMessage.value =
        "Failed to fetch weather data. Please try again later.";
      alert("Failed to fetch weather data. Please try again later.");
    } finally {
      loading.value = false;
    }
  }
  // check current Location by lat lon
  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      locationDenied.value = true;
      return;
    }

    // Check permission state first
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        alert(
          "Location permission is blocked. Please enable it in your settings."
        );
        locationDenied.value = true;
        return;
      }

      // Request current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat.value = position.coords.latitude;
          lon.value = position.coords.longitude;
          placeId.value = null;
          locationDenied.value = false;
          isLocationAccessRequested.value = false;
        },
        (error) => {
          console.error("Error getting location:", error);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("You denied the location request. Please allow access.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Try again.");
              break;
            default:
              alert("An unknown error occurred while getting your location.");
          }

          errorMessage.value =
            "Failed to get your location. Try manually entering your city.";
          locationDenied.value = true;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } catch (e) {
      console.error("Permission query failed:", e);
      alert("Failed to check location permissions.");
    }
  }

  // Get country and city based on latitude and longitude
  async function getCountryByLatLon() {
    const API_KEY = process.env.VUE_APP_API_KEY;
    try {
      const response = await axios.get(NEAREST_PLACE_URL, {
        params: {
          lat: lat.value,
          lon: lon.value,
          key: API_KEY,
        },
      });
      const data = response.data;
      weatherCity.value = data.name || data.amd_area1 || "Unknown City";
      weatherCountry.value = data.country || "Unknown Country";
    } catch (error) {
      errorMessage.value = "Failed to fetch location data.";
      console.error(error);
    }
  }

  const WeatherIcon = {
    1: "not-available.svg",
    2: "clear-day.svg",
    3: "partly-cloudy-day.svg",
    4: "partly-cloudy-day.svg",
    5: "partly-cloudy-day.svg",
    6: "cloudy.svg",
    7: "overcast.svg",
    8: "overcast.svg",
    9: "fog.svg",
    10: "drizzle.svg",
    11: "rain.svg",
    12: "partly-cloudy-day-rain.svg",
    13: "overcast-rain.svg",
    14: "thunderstorms.svg",
    15: "thunderstorms-day.svg",
    16: "snow.svg",
    17: "snow.svg",
    18: "partly-cloudy-day-snow.svg",
    19: "overcast-snow.svg",
    20: "sleet.svg",
    21: "partly-cloudy-day-sleet.svg",
    22: "sleet.svg",
    23: "sleet.svg",
    24: "partly-cloudy-day-sleet.svg",
    25: "hail.svg",
    26: "clear-night.svg",
    27: "partly-cloudy-night.svg",
    28: "partly-cloudy-night.svg",
    29: "partly-cloudy-night.svg",
    30: "cloudy.svg",
    31: "overcast-night.svg",
    32: "overcast-night-rain.svg",
    33: "thunderstorms-night.svg",
    34: "overcast-night-snow.svg",
    35: "overcast-night-sleet.svg",
    36: "partly-cloudy-night-sleet.svg",
  };
  function getWeatherIconById(iconId) {
    return WeatherIcon[iconId] || "not-available.svg";
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
    weatherCountry,
    weatherCity,
    errorMessage,
  };
});
