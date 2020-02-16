import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import monitorReducerEnhancer from './enhancers/monitorReducer';
// import axios from 'axios';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import loggerMiddleware from './middleware/logger'

const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware)
const composedEnhancers = compose(
  middlewareEnhancer,
  monitorReducerEnhancer,
)
const store = createStore(rootReducer, undefined, composedEnhancers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();