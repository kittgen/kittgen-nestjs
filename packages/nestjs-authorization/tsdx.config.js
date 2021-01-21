module.exports = {
  rollup(config, options) {
    if (!options.minify) {
      // disable Terser's minification
      config.plugins = config.plugins.filter(
        plugin => plugin.name !== 'terser'
      );
    }
    return config;
  },
};
