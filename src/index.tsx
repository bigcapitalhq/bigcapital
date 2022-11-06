// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import '@/services/yup';
import App from '@/components/App';
import * as serviceWorker from '@/serviceWorker';
import { store, persistor } from '@/store/createStore';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');

  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://021bef720bbb4ce2b98f679f72984843@o1021356.ingest.sentry.io/5987236',
    integrations: [new Integrations.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
