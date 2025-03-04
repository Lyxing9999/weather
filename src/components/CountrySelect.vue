<template>
  <!-- search country -->
  <div class="search-country">
    <h1>Search for Country</h1>
    <input
      v-model="selectCountry"
      placeholder="Search"
      @focus="dropdownVisible = true"
      @blur="handleBlur"
      @input="showDropDown"
      :aria-expanded="dropdownVisible.toString()"
      aria-describedby="country-search-list" />
    <div class="dropdown" id="country-search-list">
      <ul
        v-if="dropdownVisible && filteredOptions.length"
        class="dropdown-list"
        role="listbox">
        <li
          v-for="country in filteredOptions"
          :key="country"
          role="option"
          @click="selectOption(country)">
          {{ country }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { debounce } from "lodash-es";

const selectCountry = ref("");
const dropdownVisible = ref(false);
const allCountries = ref([]);

// Fetch country options from the API
async function fetchCountryOptions() {
  const restCountriesUrl = "https://restcountries.com/v3.1/all";
  try {
    const response = await axios.get(restCountriesUrl);
    const data = response.data;
    allCountries.value = data.map((item) => item.name.common);
  } catch (error) {
    console.error(error);
  }
}
// call fetchCountryOptions to find all country
onMounted(fetchCountryOptions);

// Filter countries based on the input value
const filteredOptions = computed(() => {
  return allCountries.value.filter((country) =>
    country.toLowerCase().includes(selectCountry.value.toLowerCase())
  );
});

// When the user selects a country from the dropdown, set the input value to the selected country
function selectOption(country) {
  selectCountry.value = country;
  dropdownVisible.value = false;
}

// When the user clicks outside the input or dropdown, hide the dropdown
function handleBlur() {
  setTimeout(() => {
    dropdownVisible.value = false;
  }, 100);
}
// Debounce input to prevent excessive API calls during typing
const showDropDown = debounce(() => {
  dropdownVisible.value =
    !!selectCountry.value && filteredOptions.value.length > 0;
}, 100);
</script>

<style scoped>
/*  container for the search country input */
.search-country {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #333;
  font-family: "Arial", sans-serif;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: background 0.5s ease-in-out;
}

/* Input field styling */
input {
  width: 80%;
  padding: 12px 15px;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid #fff;
  outline: none;
  background-color: transparent;
  color: #333;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

input:focus {
  border-color: #feb47b;
  transform: scale(1.05);
}

/* Dropdown container */
.dropdown {
  position: absolute;
  top: 90%;
  right: 0;
  transform: translateX(10px);
  z-index: 10;
  width: 200px;
}

/* Dropdown list styling */
.dropdown-list {
  max-height: 200px;
  margin-top: 10px;
  padding: 5px;
  background-color: white;
  color: #333;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  list-style-type: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
}

/* Dropdown item hover effect */
.dropdown-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.dropdown-list li:hover {
  background-color: #feb47b;
  color: white;
}

/* Show dropdown when visible */
.dropdown-list[role="listbox"] {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out;
}

@media (max-width: 500px) {
  .search-country {
    width: 90%;
    padding: 15px;
  }

  input {
    width: 90%;
    font-size: 14px;
  }

  .dropdown-list {
    width: 90%;
  }
}
</style>
