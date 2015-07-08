var path = require('path');

var sourcePath = path.resolve(__dirname, 'src', 'index.js');
var appPath = path.resolve(__dirname, 'app', 'main.js');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    appPath
  ],
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'markdown-to-react-components': sourcePath
    }
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
};
