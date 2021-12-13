const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { SourceMapDevToolPlugin } = require('webpack')
const nodeExternals = require('webpack-node-externals')

const config = {
  entry: {
    server: path.resolve(__dirname, '/src/server.ts')
  }
  , target: 'node'
  , output: {
    clean: true
    , path: path.resolve(__dirname, 'build/')
    , filename: '[name].js'
    , libraryTarget: 'commonjs2'
    , devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    , devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]'
  }
  , stats: {
    errorDetails: true
  }
  , devtool: 'source-map'
  , plugins: [
    new SourceMapDevToolPlugin({
      filename: '[name].js.map'
    })
  ]
  , module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i
        , loader: 'ts-loader'
        , exclude: [ '/node_modules/' ]
      }
    ]
  }
  , externals: [ nodeExternals() ]
  , resolve: {
    preferAbsolute: true
    , alias: {
      '@/*': path.resolve(__dirname, 'src')
      , '@gen/*': path.resolve(__dirname, 'generated')
    }
    , plugins: [ new TsconfigPathsPlugin() ]
    , extensions: [ '.ts', '.js' ]
    , fallback: {
      querystring: false
      , assert: false
      , buffer: false
      , crypto: false
      , stream: false
      , https: false
      , util: false
      , path: false
      , zlib: false
      , http: false
      , tls: false
      , net: false
      , url: false
      , os: false
      , fs: false
    }
  }
}

module.exports = config