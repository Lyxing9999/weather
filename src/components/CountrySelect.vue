<template>
  <!-- search country -->
  <div class="search-country" ref="searchBox">
    <h1>Search for Country</h1>
    <input
      name="input"
      v-model="selectedCountry"
      placeholder="Search"
      @focus="dropdownVisible = true"
      @input="toggleDropdown"
      :disabled="isCountryOrCitySelected"
      :aria-expanded="dropdownVisible"
      aria-describedby="country-search-list" />
    <div class="dropdown" id="country-search-list">
      <ul
        v-if="dropdownVisible && filteredCountries.length > 0"
        class="dropdown-list"
        role="listbox">
        <li
          v-for="country in filteredCountries"
          :key="country"
          role="option"
          @click="selectOption(country)">
          {{ country }}
        </li>
      </ul>
    </div>
    <div class="country-display-div" v-if="countries" aria-live="polite">
      <h2 class="country-display">
        <strong>Country: </strong> {{ countries[0].name }}
      </h2>
    </div>

    <label for="selectedPlaceId">city</label>
    <select
      v-model="selectedPlaceId"
      :disabled="!countries || countries.length === 0"
      id="selectedPlaceId"
      name="city">
      <option disabled :value="null">select a city</option>
      <option
        v-for="country in countries"
        :key="country.name"
        :value="country.place_id">
        {{ country.name }}
      </option>
    </select>
    <!-- Error message if weather data for the selected country is not available -->
    <p v-if="weatherError" class="error-message">
      <span v-if="weatherStore.loading">Loading...</span>
      <span v-else-if="!countries?.length && selectedCountry"
        >No cities found for this country.</span
      >
      <span v-else
        >Error: Unable to retrieve weather data. Please try again.</span
      >
      <button
        @click="getLocationData"
        :disabled="weatherStore.loading"
        aria-label="Retry getting location data">
        Retry
      </button>
    </p>

    <div class="button-container">
      <button
        :class="{ 'button-primary': !countries, 'button-normal': countries }"
        @click="getLocationData">
        <span v-if="weatherStore.loading">Loading...</span>
        <span v-else>{{ countries ? "Get Weather" : "Get City" }}</span>
      </button>
      <button v-show="countries" @click="resetAll" class="button-reset">
        Reset
      </button>
      <button @click="goBack">Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits, watch } from "vue";
import axios from "axios";
import { debounce } from "lodash-es";
import { useCountryWeatherStore } from "@/stores/countryStore";
import { useRouter } from "vue-router";

//Use Store
const weatherStore = useCountryWeatherStore();

//User Router
const router = useRouter();

// Reactive state
const selectedCountry = ref("");
const dropdownVisible = ref(false);
const countriesList = ref([]);
const searchBox = ref(null);
const weatherError = ref(false);
const countries = ref(null);
const selectedPlaceId = ref(null);

// Fetch country options from the API
async function getCountryOptions() {
  if (countriesList.value.length) return;
  const restCountriesUrl = "https://restcountries.com/v3.1/all";
  try {
    const response = await axios.get(restCountriesUrl);
    const data = response.data;
    countriesList.value = data.map((item) => item.name.common.toLowerCase());
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}
// Mounted CountryOptions to find all country
onMounted(getCountryOptions);
// Filter countries based on the input value
const filteredCountries = computed(() => {
  const search = selectedCountry.value.toLowerCase();
  return search
    ? countriesList.value.filter((country) => country.includes(search))
    : [];
});

// When the user selects a country from the dropdown, set the input value to the selected country
function selectOption(country) {
  selectedCountry.value = country;
  dropdownVisible.value = false;
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

//get weatherLocation
async function getLocationData() {
  if (!selectedCountry.value) {
    weatherError.value = true;
    return;
  }
  weatherStore.loading = true;
  weatherError.value = false;
  try {
    const encodedCountry = encodeURIComponent(selectedCountry.value.trim());
    const locationApiUrl = `https://www.meteosource.com/api/v1/free/find_places?text=${encodedCountry}&language=en&key=${process.env.VUE_APP_API_KEY}`;
    console.log("Weather API URL:", locationApiUrl);
    const response = await axios.get(locationApiUrl);
    if (!response.data?.length) throw new Error("No data found.");
    weatherError.value = false;
    countries.value = response.data;

    weatherStore.placeId = selectedPlaceId.value;
    weatherStore.lat = null;
    weatherStore.lon = null;
    weatherStore.loading = false;
    await weatherStore.getWeatherData();
    if (countries.value.length > 0) {
      selectedPlaceId.value = countries.value[0].place_id;
    }
    if (weatherStore.isWeatherApiSuccessful) router.push("/weather");
    return;
  } catch (error) {
    console.error("API Error:", error);
    weatherError.value = true;
    weatherStore.loading = false;
  } finally {
    weatherStore.loading = false;
  }
}
const isCountryOrCitySelected = computed(() => selectedPlaceId.value);

function resetAll() {
  selectedCountry.value = "";
  selectedPlaceId.value = null;
  weatherError.value = false;
  dropdownVisible.value = false;
  weatherStore.loading = false;
  countries.value = null;
}
watch(countries, (newCountries) => {
  if (newCountries && newCountries.length > 0) {
    selectedPlaceId.value = newCountries[0].placeId;
  } else {
    selectedPlaceId.value = null;
  }
});

const emit = defineEmits(["goBack"]);
function goBack() {
  emit("goBack");
}
</script>
<style scoped>
.search-country {
  width: 100%;
  max-width: 400px;
  position: absolute;
  padding: 1em 0.8em;
  background: var(--background-color);
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  text-align: center;
  color: var(--text-color);
  font-family: "Arial", sans-serif;
  transition: background 0.3s ease-in-out;
  z-index: 2; /* Ensure search input is above dropdown */
}

input {
  width: 80%;
  padding: 12px 15px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid #ddd;
  outline: none;
  background-color: transparent;
  color: var(--text-color);
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease-in-out;
}

input:focus {
  border-color: var(--primary-color);
  transform: scale(1.05);
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
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.dropdown-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.dropdown-list li:hover {
  background-color: var(--secondary-color);
  color: white;
}

.dropdown-list[role="listbox"] {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out;
}

.country-display {
  font-size: 1.6rem;
}

label[for="selectedPlaceId"] {
  display: block;
  margin-top: 1rem;
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--primary-color);
}

select {
  width: 80%;
  max-width: 300px;
  padding: 8px 15px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid #ddd;
  outline: none;
  background-color: #f9f9f9;
  color: var(--text-color);
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease-in-out;
}

select:focus {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

button {
  background-color: #ffffff;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  border-radius: 8px;
  padding: 12px 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.26s ease;
  width: 180px;
  font-weight: 500;
  text-transform: uppercase;
}

button:hover {
  background-color: var(--secondary-color);
  color: white;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.7);
}

.button-primary {
  background-color: var(--secondary-color);
  color: white;
  border: 2px solid var(--secondary-color);
}

.button-primary:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.button-normal {
  background-color: #ffffff;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
}

.button-secondary {
  background-color: #eeeeee;
  color: #888888;
  border: 2px solid #888888;
}

h1 {
  color: var(--primary-color);
  font-size: 2rem;
}

h2 {
  color: var(--primary-color);
  font-size: 1.7rem;
}

.country-display strong {
  color: var(--primary-color);
}

h1,
input,
.country-display,
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

  .dropdown {
    left: 50%;
    transform: translateX(-10%); /* Center dropdown */
  }
  .button-container {
    margin-top: 1.2rem;
  }
  .dropdown-list {
    width: 90%;
  }
  button {
    margin: 6px; /* Slightly smaller margin on mobile */
  }
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
  font-size: 14px;
  width: 68%;
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
</style>
