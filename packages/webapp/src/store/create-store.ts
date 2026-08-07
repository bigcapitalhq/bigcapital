import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
} from 'redux';
import { persistStore } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import ResetMiddleware from './reset-middleware';
import type { StoreEnhancer } from 'redux';
import monitorReducerEnhancer from '@/store/enhancers/monitor-reducer';
import loggerMiddleware from '@/store/logger.middleware';
import rootReducer from '@/store/reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const createStoreFactory = (initialState = {}) => {
  const middleware = [thunkMiddleware, loggerMiddleware];
  const enhancers = [monitorReducerEnhancer, ResetMiddleware];
  let composeEnhancers: typeof compose = compose;

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
    ...enhancers,
  ) as StoreEnhancer;

  return createReduxStore(rootReducer, initialState, enhancer);
};

export const createStore = createStoreFactory;
export const store = createStoreFactory();
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
