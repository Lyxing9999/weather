<template>
  <div ref="animationContainer" class="lottie-animation" loading="lazy"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import lottie from "lottie-web";
import animationData from "@/assets/Animation-BG.json";
const animationContainer = ref("");
let animationInstance = null;
onMounted(() => {
  if (animationContainer.value) {
    animationInstance = lottie.loadAnimation({
      container: animationContainer.value,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
  }
});
onBeforeUnmount(() => {
  if (animationInstance) {
    animationInstance.destroy();
  }
});
</script>

<style></style>
