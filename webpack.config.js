var path    = require('path');
var webpack = require('webpack');
var merge   = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;

var PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

var common = {

  // Identify the path to the file that bootstraps the application
  entry: {
    app: PATHS.app
  },

  // Identify the assets webpack should bundle
  // n.b. '' refers to files without extension
  resolve: {
    extensions: ['', '.js', '.css'],
  },

  // Identify the output directory where built assets will go
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  // Use babel to load es6
  module: {
    loaders: [
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};

// Development configuration
if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    
    // Enable sourcemaps for debugging
    devtool: 'eval-source-map',

    // Configure server
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback to facilitate
      // API-based routing. 
      historyAPIFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to minimize output
      stats: 'errors-only',

      // When using Vagrant or other VM, set:
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [

      // Use hot module replacement
      new webpack.HotModuleReplacementPlugin(),

    ]
  });
}

// Production configuration
if(TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {
    plugins: [
      
      // Optimize build for production
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),

      // Minify bundled js
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),

      // Optimize the build order
      new webpack.optimize.OccurrenceOrderPlugin(),

      // Minify js
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}