const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-ts');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const dotenvWebpack = require('dotenv-webpack');

module.exports = (webpackConfigEnv, argv) => {
  const env = webpackConfigEnv.ENV || 'local';
  const envPath = `./.env.${env}`;
  dotenv.config({ path: envPath });

  // eslint-disable-next-line no-console
  console.log('Test env in buildtime:', process.env.TEST_ENV);

  const orgName = 'hr-forte';
  const rootConfigPort = 9000;
  const legacyPort = 8080;
  const webappPort = 8081;

  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: 'root-config',
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
    outputSystemJS: true,
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
      client: {
        overlay: {
          runtimeErrors: (error) => {
            // Some problems with webpack dev server and antd table, happens in @hr-forte/legacy
            // it doesn't seem to break anything though
            // https://stackoverflow.com/a/77914968
            // https://stackoverflow.com/a/79371902
            if (error?.message === 'ResizeObserver loop completed with undelivered notifications.') {
              console.error(error);
              return false;
            }
            return true;
          },
        },
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'src/index.ejs',
        templateParameters: {
          isLocal: env === 'local',
          orgName,
          legacyPort,
          webappPort,
          rootConfigPort,
        },
      }),
      new dotenvWebpack({
        path: envPath,
      }),
    ],
  });

  // eslint-disable-next-line no-console
  console.dir(mergedConfig, { depth: null });

  return mergedConfig;
};
