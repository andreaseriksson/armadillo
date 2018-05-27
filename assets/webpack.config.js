var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var env = process.env.MIX_ENV || 'dev';
var isProduction = env === 'prod';

module.exports = {
  mode: (env === 'dev' ? 'development' : 'production'),
  entry: {
    app: ['./js/app.js', './css/app.scss'],
  },
  output: {
    path: path.resolve(__dirname, '../priv/static/'),
    filename: 'js/[name].js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: /css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        include: /js/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{from: './static'}]),
    new MiniCssExtractPlugin({
      filename: 'css/app.css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
  ],
};
