const webpack = require("webpack")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// 定义一个通用的路径转换方法
const resolvePath = pathstr => path.resolve(__dirname, pathstr)

/**
 * @type {webpack.Configuration}
 */
module.exports = {
  mode: "development",
  // 入口文件
  entry: {
    main: ['react-hot-loader/patch', resolvePath("../src/client/app/index.js")],
  },
  output: {
    // 设置打包后的文件名
    filename: "[name].js",
    // 设置构建结果的输出目录
    path: resolvePath("../dist/static"),
    publicPath: 'http://localhost:8002/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },{
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: "css-loader",
        },
        {
          loader: "postcss-loader",
          options: {
            plugins: [require("autoprefixer")]
          }
        },
        {
          loader: "sass-loader",
        },
      ],
    }, {
      test: /\.(png|jpe?g|gif)?$/,
      use: [{
        loader: "file-loader",
        options: {
          name: 'img/[name].[ext]' // 配置图片的输出路径和名称
        }
      }]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css' // 设置名称
    }),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
}