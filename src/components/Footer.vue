<template>
  <footer class="copyright" aria-label="Footer with copyright information">
    <p>
      &copy; 2025 Kaing Bunly. All Rights Reserved. SVG by
      <a
        href="https://github.com/basmilius/weather-icons"
        target="_blank"
        rel="noopener noreferrer">
        Basmilius
      </a>
    </p>
  </footer>
</template>

<script setup></script>

<style scoped>
footer {
  text-align: center;
  padding: 5px 8px;
  background: linear-gradient(90deg, #e0eafc, #cfdef3);
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  font-size: 14px; /* Smaller font size */
  opacity: 0.9;
  transition: all 0.3s ease;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

footer:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.copyright p {
  margin: 0;
  color: #333;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

.copyright a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.copyright a:hover {
  color: #0056b3;
  text-decoration: underline;
}

@media (min-width: 768px) {
  footer {
    font-size: 12px;
  }
}
</style>
