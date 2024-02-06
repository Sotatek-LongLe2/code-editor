const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new MonacoWebpackPlugin({
          // You can specify the languages you want to include here
          languages: ["javascript", "typescript", "css", "html", "json"],
        }),
      ],
    },
  },
};
