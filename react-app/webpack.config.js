const { join, resolve } = require("path");
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: join(__dirname, 'dist'),
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
          loader: 'babel-loader'
        }
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
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
    modules: [resolve('src'), resolve('node_modules')],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  plugins: [
    new CheckerPlugin()
  ],
  devtool: 'source-map',
};