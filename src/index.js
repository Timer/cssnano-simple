const postcss = require('postcss');
const createSimplePreset = require('cssnano-preset-simple');

function initializePlugin(excludeAll, plugin, css, result) {
  if (Array.isArray(plugin)) {
    const [processor, opts] = plugin;

    const isEnabled =
      // No options:
      (!excludeAll && typeof opts === 'undefined') ||
      // Short-hand enabled:
      (typeof opts === 'boolean' && opts) ||
      // Include all plugins:
      (!excludeAll && opts && typeof opts === 'object' && !opts.exclude) ||
      // Exclude all plugins:
      (excludeAll &&
        opts &&
        typeof opts === 'object' &&
        opts.exclude === false);

    if (isEnabled) {
      return Promise.resolve(processor(opts)(css, result));
    }
  } else {
    return Promise.resolve(plugin()(css, result));
  }

  return Promise.resolve();
}

module.exports = postcss.plugin('cssnano-simple', (opts = {}) => {
  const excludeAll = Boolean(opts && opts.excludeAll);

  const options = Object.assign(
    {},
    excludeAll ? { rawCache: true } : undefined,
    opts
  );

  const preset = createSimplePreset(options);
  return (css, result) => {
    return preset.plugins.reduce((promise, plugin) => {
      return promise.then(
        initializePlugin.bind(null, excludeAll, plugin, css, result)
      );
    }, Promise.resolve());
  };
});
