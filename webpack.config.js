'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const webpack = require('webpack');

const isWebpackDevServer = process.argv.filter(a => path.basename(a) === 'webpack-dev-server').length;

const isWatch = process.argv.filter(a => a === '--watch').length

const plugins =
  isWebpackDevServer || !isWatch ? [] : [
    function(){
      this.plugin('done', function(stats){
        process.stderr.write(stats.toString('errors-only'));
      });
    },
  ]
;

module.exports = {

  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    port: 4008,
    stats: 'errors-only',
    publicPath: '/'
  },

  entry: './src/entry.js',

  output: {
    path: path.join(__dirname, "build"),
    filename: isWebpackDevServer ? '[name].js' : '[name].[chunkhash].js'
  },

  module: {
    rules: [
      {
        test: /\.purs$/,
        use: [
          {
            loader: 'purs-loader',
            options: {
              pscPackage: true,
              src: [
                path.join('src', '**', '*.purs')
              ],
              bundle: true,
              watch: isWebpackDevServer || isWatch,
              pscIde: false
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'es2015'
          ]
        }
      }
    ]
  },

  resolve: {
    modules: [ 'node_modules', '.psc-package' ],
    extensions: [ '.purs', '.js']
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
           return module.context && module.context.indexOf('node_modules') !== -1;
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
    }),
    new HtmlWebpackPlugin({
      title: 'Welcome to the Working Week',
      template: path.join(__dirname, "src", "index.ejs"),
    }),

  ].concat(plugins)
};
