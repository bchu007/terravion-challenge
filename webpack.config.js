const path = require('path');

const srcPath = path.resolve(__dirname, 'src');
const publicPath = path.resolve(__dirname, 'dist');
console.log("publicPath", publicPath)
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: './src',
  output: {
    path: publicPath,
    publicPath: publicPath,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: srcPath,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-react-jsx'
            ]
          }
        }
      },
      {
        test: /\.s?(c|a)ss$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  devServer: {
    port: 3000,
    contentBase: publicPath,
    watchContentBase: true,
    stats: 'minimal'
  }
}
