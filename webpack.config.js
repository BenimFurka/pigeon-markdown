const path = require('path');

const commonConfig = {
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
              ]
            }
          },
          'ts-loader'
        ]
      }
    ]
  },
  externals: {}
};

module.exports = [
  // UMD build
  {
    ...commonConfig,
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pigeon-markdown.js',
      library: {
        name: 'PigeonMarkdown',
        type: 'umd',
      },
      globalObject: 'this',
      umdNamedDefine: true,
      libraryExport: 'default'
    }
  },
  // ESM build
  {
    ...commonConfig,
    experiments: {
      outputModule: true
    },
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pigeon-markdown.esm.js',
      library: {
        type: 'module'
      }
    }
  }
];
