const { join, resolve } = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: __dirname + '/dist',
    filename: "main.js",
    publicPath: '/'
  },
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 9000,
    watchContentBase: true,
    progress: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf)$/,
        use: ['url-loader?limit=100000']
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  resolve: {
    modules: [ resolve('src'), resolve('node_modules') ]
  }
};