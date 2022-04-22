import { AUTH, ISSIGNEDIN, LOGOUT } from '../constants/actionTypes';
import { produce } from 'immer';

const initState = {
  authData: null,
};

const authReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ISSIGNEDIN:
        const user = JSON.parse(localStorage.getItem('user'));
        draft.authData = user;
        return draft;
      case AUTH:
        localStorage.setItem('user', JSON.stringify({ ...action?.payload }));
        draft.authData = action.payload;
        return draft;
      case LOGOUT:
        localStorage.removeItem('user');
        draft.authData = null;
        return draft;
      default:
        return draft;
    }
  });

export default authReducer;
