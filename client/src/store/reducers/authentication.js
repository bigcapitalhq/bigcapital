import t from 'store/types';

export default function authentication(state = {}, action) {
  switch(action.type) {
    case t.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token,
      }
    case t.LOGOUT:
      return {
        ...state,
        token: '',
      };
    default: 
      return state;
  }
}