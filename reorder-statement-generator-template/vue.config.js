const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'output.html',
        template: 'public/index.html',
        inlineSource: '.(js|css)$', // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ],
  },
};
