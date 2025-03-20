<template>
  <div class="card">
    <div class="wind-info">
      <img
        class="icon"
        src="@/assets/weather-svg/barometer.svg"
        alt="Wind angle" />
      <span>{{ angle || "N/A" }}&deg;</span>
    </div>
    <div class="wind-info">
      <img class="icon" src="@/assets/weather-svg/wind.svg" alt="Wind speed" />
      <span>{{ speed || "N/A" }} m/s</span>
    </div>
    <div class="wind-info">
      <img
        class="icon"
        src="@/assets/weather-svg/compass.svg"
        alt="Wind direction" />
      <span>{{ dir || "N/A" }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  angle: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  dir: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 15px;
  margin-bottom: 40px;
  padding: 15px;
  background-color: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.wind-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
}

.wind-info .icon {
  width: 52px;
  height: 52px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.wind-info .icon:hover {
  transform: scale(1.1);
}

.wind-info span {
  font-size: 0.9em;
  font-weight: 600;
  color: var(--wx-text-muted);
}

.wind-info:nth-child(1) span {
  color: var(--accent-color);
}

.wind-info:nth-child(2) span {
  color: var(--wx-accent);
}

.wind-info:nth-child(3) span {
  color: var(--wx-text-primary);
}

@media (max-width: 300px) {
  .card {
    grid-template-columns: 1fr;
    background-color: transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}
</style>
