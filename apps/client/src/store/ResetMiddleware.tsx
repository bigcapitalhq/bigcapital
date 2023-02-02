// @ts-nocheck
export default (next) => (reducer, initialState, enhancer) => {
  let resetType = 'RESET'
  let resetData = 'state'

  const enhanceReducer = (state, action) => {
    if (action.type === resetType) {
      state = action[resetData]
    }
    return reducer(state, action)
  }

  return next(enhanceReducer, initialState, enhancer)
}