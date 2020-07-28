const path = require('path');

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
  }
};
