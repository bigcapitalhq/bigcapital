// @ts-nocheck

const LOCAL_STORAGE_NAMESPACE = 'application_state';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch(error) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_NAMESPACE, serializedState);
  } catch (error) {
    throw new Error('Something want wrong');
  }
}