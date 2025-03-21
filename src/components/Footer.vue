<template>
  <footer class="copyright">
    <p>&copy; 2025 Kaing Bunly. All Rights Reserved.</p>
  </footer>
</template>

<script setup></script>

<style scoped>
footer {
  text-align: center;
  padding: 5px 10px; /* Small padding */
  background-color: #f0f4f8;
  width: 100%; /* Full width */
  position: fixed;
  bottom: 0;
  left: 0; /* Aligns it to the left edge */
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  font-size: 10px; /* Smaller font */
  opacity: 0.75;
  transition: opacity 0.3s ease;
}

footer:hover {
  opacity: 1;
}

.copyright p {
  margin: 0;
  color: #666;
}
</style>
