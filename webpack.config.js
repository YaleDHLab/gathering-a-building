var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var TARGET = process.env.npm_lifecycle_event;

var PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

var common = {

  debug: true,

  // Identify the path to the file that bootstraps the application
  entry: {
    app: PATHS.app
  },

  // Identify the assets webpack should bundle
  // n.b. '' refers to files without extension
  resolve: {
    extensions: ['', '.js', '.css'],
    alias: {
      'ngRoute': 'angular-route',
      'ngSanitizer': 'angular-sanitizer',
      'rzModule': 'angularjs-slider'
    }
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
        // css parser
        test: /\.css$/, 
        loader: 'style-loader!css-loader!autoprefixer-loader'
      },
      {
        // javascript parser
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        // font parser
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
      },
      {
        // catchall file loader
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
        // base64 encode images less than 10kb to reduce requests
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader?limit=10000&name=assets/images/img-[hash:6].[ext]"
      },
      {
        // large image parser
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader?name=assets/images/img-[hash:6].[ext]"
      },
      {
        // html parser
        test: /\.html$/,
        loader: "html-loader"
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
      port: process.env.PORT || 8000
    },
    plugins: [

      // Use hot module replacement
      new webpack.HotModuleReplacementPlugin()

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

      /*
      // Minify bundled js
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      */

      // Optimize the build order
      new webpack.optimize.OccurrenceOrderPlugin(),

      new ExtractTextPlugin("style.css", {allChunks: false})
    ]
  });
}