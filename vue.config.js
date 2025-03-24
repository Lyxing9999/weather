module.exports = {
  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(250000).maxAssetSize(250000);
    config.optimization.splitChunks({
      minSize: 10000,
      maxSize: 250000,
    });
  },
  configureWebpack: {
    externals:
      process.env.NODE_ENV === "production"
        ? {
            "lottie-web": "lottie",
          }
        : {},
  },
};

const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  // ... previous config
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.(js|css|json|html|ico|svg)(\?.*)?$/i,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
    performance: {
      hints: "warning",
      maxEntrypointSize: 1024 * 1024,
      maxAssetSize: 1024 * 1024,
    },
  },
};
