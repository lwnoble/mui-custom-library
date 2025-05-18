// webpack.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

export default {
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
        use: {
          loader: 'babel-loader',
          options: {
            // Inline babel options as a fallback
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
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
        title: 'Design System Demo',
        templateContent: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design System Demo</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
      })
    ])
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    },
    port: 3001,
    open: true,
    historyApiFallback: true
  }
};