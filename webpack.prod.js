const TerserPlugin = require('terser-webpack-plugin')

const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')

module.exports = merge(common, {
  mode: 'production'
  , devtool: 'source-map'
  , output: {
    clean: true
    , path: path.resolve(__dirname, 'build/production')
    , filename: '[name].js'
    , libraryTarget: 'commonjs2'
  }
  , target: 'node'
  , optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
})
