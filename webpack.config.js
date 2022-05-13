const path = require('path')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.scss', '.js', '.json', '.png', '.gif', '.jpg', '.svg'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'styled-components': path.resolve('./node_modules/styled-components')
    }
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'styled-components': 'styled-components'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '',
    filename: 'multiselect-react.js',
    libraryTarget: 'umd'
  }
}
