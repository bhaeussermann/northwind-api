const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/server.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  node: {
    __dirname: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/*.yaml',
          to: '',
          flatten: true
        }
      ]
    }),
    new CopyPlugin({
      patterns: [
        './node_modules/swagger-ui-dist/swagger-ui.css',
        './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
        './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
        './node_modules/swagger-ui-dist/favicon-16x16.png',
        './node_modules/swagger-ui-dist/favicon-32x32.png'
      ]
    })
  ]
};
