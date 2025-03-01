<template>
  <input type="text" placeholder="Enter your country" />
  <h1>{{ apiKey }}</h1>
</template>
<script setup>
import axios from "axios";
// const apiKey = process.env.VUE_APP_API_KEY;
// const find_place = "Phnom Penh";
async function fetchWeather() {
  const url = `https://www.meteosource.com/api/v1/free/point?place_id=khan-dangkao&sections=all&timezone=auto&language=en&units=auto&key=a8k3y9o4c924jpd75383mghnqdmey3kx58un2ffh`;
  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    console.log(weatherData);
  } catch (error) {
    console.error(error);
  }
}
fetchWeather();
</script>
