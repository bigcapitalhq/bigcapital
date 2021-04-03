const path = require('path');
const {
  NODE_ENV = 'production',
} = process.env;
// const nodeExternals = require('webpack-node-externals');



module.exports = {
  entry: [
    // 'regenerator-runtime/runtime',
      './src/server.ts',
  ],
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
//   externals: [nodeExternals()],
  resolve: {
    //   preferRelative: true,
    extensions: ['.ts', '.js'],
    alias: {
        'loaders': path.resolve(__dirname, 'src/loaders'),
        'services': path.resolve(__dirname, 'src/services'),
        'collection': path.resolve(__dirname, 'src/collection'),
        'config': path.resolve(__dirname, 'src/config'),
        'api': path.resolve(__dirname, 'src/api'),
        'data': path.resolve(__dirname, 'src/data'),
        'database': path.resolve(__dirname, 'src/database'),
        'decorators': path.resolve(__dirname, 'src/decorators'),
        'exceptions': path.resolve(__dirname, 'src/exceptions'),
        'interfaces': path.resolve(__dirname, 'src/interfaces'),
        'jobs': path.resolve(__dirname, 'src/jobs'),
        'lib': path.resolve(__dirname, 'src/lib'),
        'utils': path.resolve(__dirname, 'src/utils'),
        

        'locales': path.resolve(__dirname, 'src/locales'),
        'models': path.resolve(__dirname, 'src/models'),
        'repositories': path.resolve(__dirname, 'src/repositories'),
        'services': path.resolve(__dirname, 'src/services'),
        'subscribers': path.resolve(__dirname, 'src/subscribers'),
        'system': path.resolve(__dirname, 'src/system'),

        
        
        
        
        
        // 
        // 
        // 
        // 
        
        // 
        // 
        // 
    }
  },
  module: {
    rules: [{
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        test: /\.ts?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ],
    }]
  }
}