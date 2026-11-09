import type { RootState } from './reducers';

const LOCAL_STORAGE_NAMESPACE = 'application_state';

export const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState) as RootState;
  } catch {
    return undefined;
  }
};

export const saveState = (state: Partial<RootState>): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(state));
  } catch {
    throw new Error('Something went wrong saving state');
  }
};
