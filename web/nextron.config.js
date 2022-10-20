module.exports = {
  webpack: (defaultConfig, env) => Object.assign(defaultConfig, {
    entry: {
      background: './main/background.ts',
    },
  }),
  rendererSrcDir:'src',
  mainSrcDir:'main'
};
