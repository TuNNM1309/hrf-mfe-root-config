const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-ts');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackConfigEnv, argv) => {
  const orgName = 'hr-forte';
  // TODO: Might have to move this into .env file
  const rootConfigPort = 9000;
  const legacyPort = 8080;
  const webappPort = 8081;

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
      port: rootConfigPort,
      proxy: [
        {
          context: ['/assets'],
          target: `http://localhost:${legacyPort}`,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'src/index.ejs',
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
          legacyPort,
          webappPort,
          rootConfigPort,
        },
      }),
    ],
  });

  // eslint-disable-next-line no-console
  console.dir(mergedConfig, { depth: null });

  return mergedConfig;
};
