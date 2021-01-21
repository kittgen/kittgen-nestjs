module.exports = {
  rollup(config, options) {
    if (!options.minify) {
      // disable Terser's minification
      config.plugins = config.plugins.filter(
        plugin => plugin.name !== 'terser'
      );
      // remove `.min` suffix since we're no longer minifying
      config.output.file = config.output.file.replace('.min', '');
    }
    return config;
  },
};
