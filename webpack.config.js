import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { fileURLToPath } from 'url'
const { dirname } = path
const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  stats: {
    errorDetails: true
  },
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Deteams a teams link',
      template: 'template-index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'docs')
  },
  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
