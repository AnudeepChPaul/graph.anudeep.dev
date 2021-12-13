const NodemonPlugin = require('nodemon-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(require('./webpack.common'), {
  mode: 'development'
  , output: {
    clean: true
    , path: path.resolve(__dirname, 'build/development')
    , filename: '[name].js'
    , libraryTarget: 'commonjs2'
  }
  , watchOptions: {
    ignored: /node_modules/
  }
  , plugins: [
    new NodemonPlugin({
      script:  './build/development/server.js'
      , watch: path.resolve(__dirname, 'build/development/')
      , ignore: [ 'node_modules' ]
      // , args: [ '--inspect' ]
      , nodeArgs: [
        '--inspect-brk'
        , '-r'
        , 'dotenv/config' 
      ]
    })
  ]
})