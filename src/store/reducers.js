import { SET_AUTHENTICATED } from './actions';

const initialState = {
  isAuthenticated: false,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
    default:
      return state;
  }
}

export default appReducer;