import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore } from 'redux-persist';
import monitorReducerEnhancer from '@/store/enhancers/monitor-reducer';
import loggerMiddleware from '@/store/logger.middleware';
import rootReducer from '@/store/reducers';
import ResetMiddleware from './reset-middleware';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const createStoreFactory = (initialState = {}) => {
  const middleware = [thunkMiddleware, loggerMiddleware];
  const enhancers = [monitorReducerEnhancer, ResetMiddleware] as any[];
  let composeEnhancers: typeof compose = compose;

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const store = createReduxStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware), ...enhancers),
  );
  (store as any).asyncReducers = {};
  return store;
};

export const createStore = createStoreFactory;
export const store = createStoreFactory();
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
