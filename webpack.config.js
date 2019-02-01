const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: "./src/index",
   mode: "development",
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader",
            options: { presets: ["@babel/env"] }
         },
         {
            test: /\.(css|scss)$/,
				use: [
					"style-loader", 	//takes css and inserts it into the page
               "css-loader", 		//translates css into commonJS
               "sass-loader"
				]
         }
      ]
   },
   resolve: { extensions: ["*", ".js", ".jsx"] },
   output: {
      path: path.resolve(__dirname, "dist/"),
      publicPath: "/dist/",
      filename: "bundle.js"
   },
   devServer: {
      contentBase: path.join(__dirname, "public/"),
      port: 3000,
      publicPath: "http://localhost:3000/dist/",
      hotOnly: true
   },
   plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({   
         favicon: './src/images/favicon.ico'})
      ]
};
