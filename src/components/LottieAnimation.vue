<template>
  <div ref="animationContainer" class="lottie-animation"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import lottie from "lottie-web";
import animationData from "@/assets/Animation-BG.json";
const animationContainer = ref("");
let animationInstance = null;
onMounted(() => {
  animationInstance = lottie.loadAnimation({
    container: animationContainer.value,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: animationData,
  });
});
onBeforeUnmount(() => {
  if (animationInstance) {
    animationInstance.destroy();
  }
});
</script>

<style scoped>
.lottie-animation {
  width: 100%;
  height: 100%;
}
</style>
