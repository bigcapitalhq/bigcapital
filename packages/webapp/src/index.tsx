import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import App from '@/components/App';
import * as serviceWorker from '@/serviceWorker';
import '@/services/yup';
import { persistor, store } from '@/store/createStore';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, { trackAllPureComponents: false });
// }

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

// THIS IS WHAT WE WILL UPGRADE TO IN THE FUTURE
//
// const container = document.getElementById('root');
// const root = createRoot(container!); // createRoot(container!) if you use TypeScript

// root.render(
//   // <React.StrictMode>
//    <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </PersistGate>
//   </Provider>
//   // </React.StrictMode>,
// );

// // Service worker update
// serviceWorker.unregister();