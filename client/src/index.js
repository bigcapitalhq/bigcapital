import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'services/yup';
import App from 'components/App';
import * as serviceWorker from 'serviceWorker';
import createStore from 'store/createStore';
import AppProgress from 'components/NProgress/AppProgress';

import {locale} from 'lang/en/locale';
import whyDidYouRender from "@welldone-software/why-did-you-render";

whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: "green",
  diffNameColor: "aqua"
});


ReactDOM.render(
  <Provider store={createStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

ReactDOM.render(
  <Provider store={createStore}>
    <AppProgress />
  </Provider>,
  document.getElementById('nprogress')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();