const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const PATHS = {
  source: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
};

module.exports = {
  context: PATHS.source,

  entry: PATHS.source + '/js/app.js',

  output: {
    filename: 'js/bundle.js',
    publicPath: '/',
    path: PATHS.dist
  },

  devServer: {
    stats: 'errors-only'
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: 'template/index.pug',
      filename: 'index.html',
      inject: false
    }),
    new ExtractTextPlugin({
      filename: 'css/styles.css',
      allChunks: true
    }),
    new CleanPlugin(PATHS.dist)
  ],


  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(jade|pug)$/,
        use: ['html-loader', 'pug-html-loader?pretty=true']
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader?minimize', 'postcss-loader', 'sass-loader', 'import-glob-loader']
          })
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      }
    ]
  }
};