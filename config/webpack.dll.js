const os = require('os')
const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { resolve, shareRules, __DEV__, GLOBALS, dllPath, dllContext, devtool, stats } = require('./webpack.base.js')

const antdMobileVendor = _.flatten(
  [
    'button', 'list', 'activity-indicator', 'toast', 'result',
    'list-view', 'pull-to-refresh', 'icon', 'modal',
  ].map(component => {
    return [`antd-mobile/lib/${component}/index.js`, `antd-mobile/lib/${component}/style`]
  })
)

const vendor = [
  'react', 'react-dom', 'prop-types', 'mobx', 'mobx-react', 'qs', 'react-router', 'react-router-dom',
  'isomorphic-fetch', 'fastclick',
]

!__DEV__ && vendor.push(...antdMobileVendor)

module.exports = {
  entry: {
    vendor
  },
  output: {
    path: dllPath,
    filename: __DEV__ ? "[name].js" : "[name].min.js",
    library: '[name]_library',
  },
  resolve,
  devtool,
  plugins: [
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin())
    __DEV__ ? { apply: () => null } :
      new UglifyJsParallelPlugin({
        workers: os.cpus().length,
        mangle: true,
        compressor: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        }
      }),
    new webpack.DllPlugin({
      context: dllContext,
      path: path.join(dllPath, __DEV__ ? "[name]-manifest.json" : "[name]-manifest.min.json"),
      name: '[name]_library'
    }),
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: true
    }),
  ],
  module: {
    rules: shareRules
  },
  stats,
}