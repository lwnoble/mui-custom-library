// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: isProduction ? './src/lib.js' : './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: isProduction ? {
      name: 'CustomMuiLibrary',
      type: 'umd',
    } : undefined,
    globalObject: 'this',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: isProduction ? {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@mui/material': 'MuiMaterial',
    '@emotion/react': 'emotionReact',
    '@emotion/styled': 'emotionStyled'
  } : {},
  plugins: [
    ...(isProduction ? [] : [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ])
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    open: true,
    historyApiFallback: true
  }
};