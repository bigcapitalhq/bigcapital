import type { StoreEnhancer, StoreEnhancerStoreCreator } from 'redux';

const round = (number: number) => Math.round(number * 100) / 100;

type AnyReducer = (state: any, action: any) => any;

type StoreCreatorWithEnhancer = (
  reducer: AnyReducer,
  preloadedState?: any,
  enhancer?: StoreEnhancer,
) => ReturnType<StoreEnhancerStoreCreator>;

const monitorReducerEnhancer: StoreEnhancer = (createStore) => {
  const createStoreWithEnhancer = createStore as StoreCreatorWithEnhancer;

  const enhancedCreator = (
    reducer: AnyReducer,
    initialState?: any,
    enhancer?: StoreEnhancer,
  ) => {
    const monitoredReducer: AnyReducer = (state, action) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);
      console.log('reducer process time:', diff);
      return newState;
    };
    return createStoreWithEnhancer(monitoredReducer, initialState, enhancer);
  };

  return enhancedCreator as StoreEnhancerStoreCreator;
};
export default monitorReducerEnhancer;
