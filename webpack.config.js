const path = require('path');
const preprocess = require('svelte-preprocess');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV ?? 'development';
const isProduction = mode === 'production';

module.exports = {
  mode,
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve('svelte/package.json')),
    },
    extensions: ['.mjs', '.js', '.svelte', '.ts'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: !isProduction
            },
            emitCss: isProduction,
            hotReload: !isProduction,
            preprocess: preprocess({
              typescript: true,
            }),
          }
        }
      },
      {
        test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/,
      },
      {
        test: /\.css$/, use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/img'), to: path.resolve(__dirname, 'build/img') },
        { from: path.resolve(__dirname, 'src/manifest.webmanifest'), to: path.resolve(__dirname, 'build') },
      ],
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
  },
};
