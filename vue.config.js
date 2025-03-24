const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  outputDir: "dist",

  configureWebpack: {
    optimization: {
      minimize: true, // Minifies the output JavaScript files
      splitChunks: {
        chunks: "all", // Automatically splits larger chunks into smaller ones
        maxSize: 200000, // Limits the maximum size of a chunk to 200KB
      },
    },
    // This plugin helps to analyze your bundle size after the build process
    plugins: [
      // Uncomment the next two lines if you want to use webpack-bundle-analyzer
      // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
    ],
  },

  chainWebpack: (config) => {
    // Enable gzip compression for production builds
    if (process.env.NODE_ENV === "production") {
      config.plugin("compression").use(require("compression-webpack-plugin"), [
        {
          algorithm: "gzip", // Or 'brotli' for better compression
          test: /\.(js|css|html|svg)$/,
          threshold: 8192, // Only compress assets bigger than 8KB
          minRatio: 0.8, // Compress if the file can be reduced by 20%
        },
      ]);
    }

    // Preload large assets to improve loading performance
    config.plugins.delete("preload"); // Removes default preload, if unnecessary
    config.plugins.delete("prefetch"); // Removes prefetching of assets not in use
  },
});
