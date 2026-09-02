import {Provider} from 'react-redux';
import {Router} from 'wouter';

import {store} from '../store';
import Routes from '../Routes';

// Vite sets import.meta.env.BASE_URL to "/via-app/" in production (see
// vite.config.ts). wouter's Router base must be that path without the trailing
// slash, so useLocation() returns "/test" rather than "/via-app/test" under
// the GitHub Pages subpath. In dev BASE_URL is "/", which becomes "" (no base).
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '');

export default () => (
  <Provider store={store}>
    <Router base={routerBase}>
      <Routes />
    </Router>
  </Provider>
);
