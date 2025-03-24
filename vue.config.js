const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true, // Ensures necessary dependencies are transpiled

  // Defines base public path depending on the environment
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",

  // Output directory for production build
  outputDir: "dist",

  configureWebpack: {
    optimization: {
      minimize: true, // Minifies JavaScript files for production
      splitChunks: {
        chunks: "all", // Split chunks for better caching
        maxSize: 200000, // Limit chunk size to 200KB
      },
    },
    plugins: [
      // Optionally, add webpack-bundle-analyzer plugin to analyze bundle size
      // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
    ],
  },

  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // Add gzip compression for production build to reduce bundle size
      config.plugin("compression").use(CompressionPlugin, [
        {
          algorithm: "gzip", // Gzip compression
          test: /\.(js|css|html|svg)$/, // Files to compress
          threshold: 8192, // Compress files > 8KB
          minRatio: 0.8, // Compress files if they can be reduced by 20%
        },
      ]);
    }

    // Remove unnecessary preload and prefetch plugins for improved performance
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
  },
});
