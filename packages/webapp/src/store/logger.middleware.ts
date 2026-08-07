import type { Middleware } from 'redux';

const logger: Middleware = (store) => (next) => (action) => {
  console.group((action as { type?: string }).type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
export default logger;
