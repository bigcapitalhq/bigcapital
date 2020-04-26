import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import monitorReducerEnhancer from 'store/enhancers/monitorReducer';
import loggerMiddleware from 'middleware/logger'
import rootReducer from 'store/reducers';
import { loadState, saveState } from 'store/localStorage';

const createStore = (initialState = {
  ...loadState(),
}) => {
  /**
  |--------------------------------------------------
  | Middleware Configuration
  |--------------------------------------------------
  */
  const middleware = [
    thunkMiddleware,
    loggerMiddleware,
  ];

  /**
  |--------------------------------------------------
  | Store Enhancers
  |--------------------------------------------------
  */
  const enhancers = [
    monitorReducerEnhancer,
  ];
  let composeEnhancers = compose;

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  /**
  |--------------------------------------------------
  | Store Instantiation and HMR Setup
  |--------------------------------------------------
  */
  const store = createReduxStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware), ...enhancers)
  );
  store.asyncReducers = {};

  store.subscribe(() => {
    saveState({
      authentication: store.getState().authentication,
    });
  });
  return store;
};
export default createStore();
