const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-ts');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackConfigEnv, argv) => {
  const orgName = 'hr-forte';
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: 'root-config',
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
    outputSystemJS: false,
  });

  const mergedConfig = merge(defaultConfig, {
    devServer: {
      port: 9000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'src/index.ejs',
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
  });

  // eslint-disable-next-line no-console
  console.dir(mergedConfig, { depth: null });

  return mergedConfig;
};
