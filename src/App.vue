<template>
  <router-view></router-view>
  <Footer />
</template>
<script setup>
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}
footer {
  margin-top: auto;
}
</style>
