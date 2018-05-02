const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const vueConfig = require('./vue-loader.config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSCSS = new ExtractTextPlugin({
  filename: 'common.[chunkhash].css',
  allChunks: true
});
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: isProd ? false : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      public: path.resolve(__dirname, '../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: isProd
          ? extractSCSS.extract({
              use: ['css-loader?minimize'],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: isProd
          ? extractSCSS.extract({
              use: ['css-loader?minimize', 'sass-loader'],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  mode: process.env.NODE_ENV,
  plugins: isProd
    ? [new webpack.optimize.ModuleConcatenationPlugin(), extractSCSS]
    : [new VueLoaderPlugin(), new FriendlyErrorsPlugin()]
};
