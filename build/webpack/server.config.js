import webpack from 'webpack';
import fs from 'fs';
import base, { cssIdentName } from './base';
import { paths, globals } from '../../config';

export default {
  ...base,
  name: 'server',
  target: 'node',
  externals: fs.readdirSync('node_modules').filter(x => x !== '.bin'),
  entry: paths.app('entryPoints/server'),
  output: {
    filename: 'index.js',
    path: paths.dist('server'),
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      ...base.module.loaders.filter(loaderConfig => {
        if (/\.js/.test(loaderConfig.test)) {
          return true;
        }
        return false;
      }),
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'css/locals?modules&localIdentName=' + cssIdentName,
          'cssnext',
        ],
      },
      {
        test: /\.css$/,
        include: paths.base('node_modules'),
        loaders: ['css/locals'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ...globals,
      __CLIENT__: false,
      __SERVER__: true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ],
};
