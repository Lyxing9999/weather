<template>
  <!-- Search Country -->
  <Transition name="from-slide">
    <div v-show="searchBox" class="search-country" ref="searchBox">
      <h1>Search for Country</h1>
      <input
        name="input"
        autocomplete="off"
        v-model="selectedCountry"
        placeholder="Search"
        @focus="dropdownVisible = true"
        @input="toggleDropdown"
        :disabled="isCountryOrCitySelected"
        :aria-expanded="dropdownVisible"
        aria-describedby="country-search-list" />

      <!-- Dropdown -->
      <Transition name="dropdown-fade">
        <div
          class="dropdown"
          id="country-search-list"
          v-if="dropdownVisible && filteredCountries.length > 0">
          <ul class="dropdown-list" aria-live="polite" role="listbox">
            <li
              v-for="country in filteredCountries"
              :key="country"
              role="option"
              @click="selectOption(country)">
              {{ country }}
            </li>
          </ul>
        </div>
      </Transition>

      <label for="selectedPlaceId">City</label>
      <select
        v-model="selectedPlaceId"
        :disabled="!cities || cities.length === 0"
        id="selectedPlaceId"
        name="city">
        <option disabled :value="null">Select a city</option>
        <option
          v-for="(city, index) in cities"
          :key="index"
          :value="city.place_id">
          {{ city.name }}
        </option>
      </select>

      <!-- Error message if weather data for the selected country is not available -->
      <Transition name="error-fade">
        <p
          v-if="weatherError && !dropdownVisible"
          class="error-message"
          aria-live="assertive"
          role="alert">
          <span v-if="weatherStore.loading">Loading...</span>
          <span v-else-if="!cities?.length && selectedCountry"
            >No cities found for this country.</span
          >
          <span v-else>Error: Unable to retrieve weather data.</span>
          <button
            @click="getLocationData"
            :disabled="weatherStore.loading"
            aria-label="Retry getting location data">
            Retry
          </button>
        </p>
      </Transition>
      <div class="button-container buttons">
        <button
          :class="{ 'button-primary': cities, 'button-normal': !cities }"
          @click="getLocationData">
          <span v-if="weatherStore.loading">Loading...</span>
          <span v-else>{{ cities ? "Get Weather" : "Search Cities" }}</span>
        </button>
        <button v-show="cities" @click="resetAll" class="button-reset buttons">
          Reset
        </button>
        <button class="button-back" @click="goBack">Back</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits, watch } from "vue";
import axios from "axios";
import { debounce } from "lodash-es";
import { useCountryWeatherStore } from "@/stores/countryStore";
import { useRouter } from "vue-router";

// Use Store
const weatherStore = useCountryWeatherStore();

// User Router
const router = useRouter();

// Reactive state
const selectedCountry = ref("");
const dropdownVisible = ref(false);
const countriesList = ref([]);
const searchBox = ref(null);
const weatherError = ref(false);
const cities = ref(null);
const selectedPlaceId = ref(null);

// Fetch country options from the API
async function getCountryOptions() {
  if (countriesList.value.length) return;
  const restCountriesUrl = "https://restcountries.com/v3.1/all";
  try {
    const response = await axios.get(restCountriesUrl);
    countriesList.value = response.data.map((item) => item.name.common);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// Mounted CountryOptions to fetch all countries
onMounted(getCountryOptions);

// Filter countries based on the input value
const filteredCountries = computed(() => {
  const searchQuery = selectedCountry.value.toLowerCase();
  return searchQuery
    ? countriesList.value.filter((country) =>
        country.toLowerCase().includes(searchQuery)
      )
    : [];
});

// When the user selects a country from the dropdown, set the input value
function selectOption(country) {
  selectedCountry.value = country;
  dropdownVisible.value = false;
  weatherError.value = false;
}

// When the user clicks outside the input or dropdown, hide the dropdown
function handleClickOutside(event) {
  if (searchBox.value && !searchBox.value.contains(event.target)) {
    dropdownVisible.value = false;
  }
}

// Attach and remove event listeners
onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

// Debounce input to prevent excessive API calls during typing
const toggleDropdown = debounce(() => {
  dropdownVisible.value =
    !!selectedCountry.value && filteredCountries.value.length > 0;
}, 100);

// Get weather location data
async function getLocationData() {
  if (!selectedCountry.value) {
    weatherError.value = true;
    return;
  }
  if (weatherStore.placeId) {
    await weatherStore.getWeatherData();
    if (weatherStore.isWeatherApiSuccessful) {
      router.push({ path: "/weather", query: { refresh: Date.now() } });
      return;
    }
  }

  weatherStore.loading = true;
  weatherError.value = false;
  try {
    const encodedCountry = encodeURIComponent(selectedCountry.value.trim());
    const locationApiUrl = `https://www.meteosource.com/api/v1/free/find_places?text=${encodedCountry}&language=en&key=${process.env.VUE_APP_API_KEY}`;
    const response = await axios.get(locationApiUrl);
    if (!response.data?.length) throw new Error("No data found.");
    cities.value = response.data;
    weatherStore.lat = null;
    weatherStore.lon = null;
    weatherStore.loading = false;
    selectedPlaceId.value = cities.value[0]?.place_id || null;
    weatherStore.placeId = selectedPlaceId.value;
  } catch (error) {
    console.error("API Error:", error);
    weatherError.value = true;
    weatherStore.loading = false;
  } finally {
    weatherStore.loading = false;
  }
}

// Check if a country or city has been selected
const isCountryOrCitySelected = computed(
  () => selectedPlaceId.value || weatherStore.loading
);

// Reset the form
function resetAll() {
  selectedCountry.value = "";
  selectedPlaceId.value = null;
  weatherError.value = false;
  dropdownVisible.value = false;
  weatherStore.loading = false;
  cities.value = null;
}

// Watch for changes in selected country
watch(selectedCountry, (newSelectedCountry) => {
  if (newSelectedCountry) {
    weatherStore.placeId = null;
  }
});

// Watch for changes in selected place ID (city)
watch(selectedPlaceId, (newPlaceId) => {
  if (newPlaceId) {
    const selectedCity = cities.value.find(
      (city) => city.place_id === newPlaceId
    );
    if (selectedCity) {
      weatherStore.weatherCountry = selectedCity.country || "Unknown";
      weatherStore.weatherCity = selectedCity.name;
    }
  }
});

// Store previous values
let prevCountry = weatherStore.weatherCountry;
let prevCity = weatherStore.weatherCity;
const emit = defineEmits(["goBack"]);
function goBack() {
  if (
    weatherStore.weatherCountry !== prevCountry ||
    weatherStore.weatherCity !== prevCity
  ) {
    weatherStore.weatherCountry = prevCountry;
    weatherStore.weatherCity = prevCity;
  }
  router.back();
  emit("goBack");
}
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translate(10px);
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.from-slide-enter-active {
  transition: all 0.4s ease-out;
}
.from-slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.from-slide-leave-active {
  transition: all 0.2s ease-in;
}
.from-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
.search-country {
  width: 100vw;
  max-width: 400px;
  position: absolute;
  height: auto;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  background-color: var(--background-color);
  text-align: center;
  color: var(--primary-gradient);
  top: 5%;
  padding: 1em;
  padding-block: 3em;
  font-family: "Arial", sans-serif;
  z-index: 10;
  box-shadow: 0 -6px 15px rgba(0, 0, 0, 0.2);
}

input {
  width: 80%;
  padding: 12px 15px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid #ddd;
  background-color: transparent;
  color: var(--primary-gradient);
  transition: all 0.3s ease;
}

input:focus {
  border-color: #1b3b6f;
  background-color: rgba(240, 248, 255, 0.1);
  color: #333;
  transform: scale(1.02);
  box-shadow: 0 0 8px rgba(27, 59, 111, 0.3);
  outline: none;
}
.dropdown {
  position: absolute;
  right: 0;
  width: 100%;
  max-width: 200px;
  z-index: 5;
}

.dropdown-list {
  max-height: 200px;
  padding: 5px;
  background-color: #f4f7fb;
  color: var(--text-color);
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  list-style-type: none;
}

.dropdown-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
}

.dropdown-list li:hover {
  background-color: var(--secondary-color);
  color: white;
}

label[for="selectedPlaceId"] {
  display: block;
  margin-top: 1rem;
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--primary-gradient);
}

select {
  width: 80%;
  max-width: 300px;
  padding: 8px 15px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid #ddd;
  background-color: #f9f9f9;
  color: var(--text-color);
  box-shadow: var(--box-shadow);
  outline: none;
  transition: all 0.3s ease;
}

select:focus {
  border-color: var(--border-color);
}

h1 {
  color: var(--primary-gradient);
  font-size: 2rem;
}

h2 {
  color: var(--primary-gradient);
  font-size: 1.7rem;
}

h1,
input,
select {
  margin-top: 1.4em;
}

label {
  margin-top: 1em;
}

.button-container {
  margin-top: 1.2em;
}

button {
  margin: 6px;
}

input:disabled,
select:disabled {
  color: var(--disabled-color);
  background-color: var(--disabled-bg-color);
  border: 2px solid #ddd;
  cursor: not-allowed;
  opacity: 0.6;
}

input:disabled:focus,
select:disabled:focus {
  outline: none;
  box-shadow: none;
}

select option:disabled {
  color: var(--disabled-color);
  background-color: var(--disabled-bg-color);
}

select:disabled,
select option:disabled {
  background-color: #eee;
  pointer-events: none;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.error-message button {
  background-color: #fdd;
  color: #d00;
  border: 1px solid #d00;
  padding: 4px 8px;
  margin-left: 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

select {
  font-size: 1rem;
  width: 70%;
  margin-bottom: 10px;
}

select:disabled {
  color: var(--disabled-color);
}

select option:disabled {
  color: var(--disabled-color);
}

select option:first-child {
  color: var(--disabled-color);
}

select:disabled,
select option:disabled {
  background-color: #eee;
  pointer-events: none;
}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.button-primary {
  background-color: var(--secondary-color);
  position: relative;
  color: #ffffff;
  border: 2px solid var(--secondary-color);
  font-size: 0.95rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button-primary:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.button-primary:hover {
  background-color: var(--secondary-color-hover);
  transform: scale(1.02);
}

.button-primary:hover:before {
  left: 100%;
}

.button-primary:active {
  transform: scale(1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.button-normal {
  background-color: #ffffff;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button-normal:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
}

.button-normal:hover {
  background-color: var(--secondary-color-hover);
  color: #ffffff;
}

.button-normal:hover:before {
  left: 100%;
}

.button-normal:active {
  transform: scale(1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}
.button-reset {
  width: 200px;
}
.buttons {
  gap: 1px;
}
@media (max-width: 500px) {
  h1 {
    font-size: 1.8rem;
  }
  .country-display {
    font-size: 1.3rem;
  }
  .search-country {
    width: 80%;
  }
  input {
    width: 80%;
    font-size: 14px;
  }
  .button-container {
    margin-top: 1.2rem;
  }
  .dropdown-list {
    width: 90%;
  }
  button {
    margin: 6px;
  }
}
</style>
