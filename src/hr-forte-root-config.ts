import { registerApplication, start } from 'single-spa';
import { constructApplications, constructRoutes, constructLayoutEngine } from 'single-spa-layout';
import microfrontendLayout from './microfrontend-layout.html';

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
    // return import(/* webpackIgnore: true */ name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);

// import('@hr-forte/legacy').then(() => {
// System.import('@hr-forte/legacy').then(() => {
//   layoutEngine.activate();
//   start();
// });
console.info('Test env in runtime', process.env.TEST_ENV);
layoutEngine.activate();
start();
