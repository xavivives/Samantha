var dest = './../extension',
  src = './src',
  mui = './node_modules/material-ui/src';

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + '/**'
    ]
  },
  markup: {
    src: src + "/www/**",
    dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs:
    [
    {
      entries: src + '/background.js',
      dest: dest,
      outputName: 'background.js'
    },
    {
      entries: src + '/content.js',
      dest: dest,
      outputName: 'content.js'
    },
    {
      entries: src + '/search.js',
      dest: dest,
      outputName: 'search.js'
    },
    {
      entries: src + '/popup.js',
      dest: dest,
      outputName: 'popup.js'
    }],
    extensions: ['.js'],
  }
};