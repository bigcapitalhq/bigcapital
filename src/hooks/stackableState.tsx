import {useState} from 'react';

const useStackableState = (initialState = []) => {
  const [stackableState, setStackableState] = useState(initialState);

  const indexState = (state) => stackableState.indexOf(state);
  const hasState = (state) => indexState(state) !== -1;

  const removeState = (state) => {
    if (this.hasState(state)) {
      const index = indexState(state);
      const mutableState = [...stackableState];
      mutableState.splice(index, 1);

      setStackableState(mutableState);
    }
  };
  const setState = (state) => {
    if (!hasState(state)) {
      setStackableState([
        ...stackableState,
        state,
      ]);
    }
  };

  return {
    state: stackableState,
    removeState,
    indexState,
    hasState,
    setState,
  };
};

export default useStackableState;