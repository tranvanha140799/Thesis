import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const authActions = {
  signIn: (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.signIn(formData);

      dispatch(actions.auth({ data }));

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  },

  isSignedIn: () => async (dispatch) => {
    try {
      dispatch(actions.isSignedIn());
    } catch (error) {
      console.log(error);
    }
  },

  signUp: (formData, navigate) => async (dispatch) => {
    console.log(formData);
    try {
      const { data } = await api.signUp(formData);

      dispatch(actions.auth({ data }));

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  },

  logOut: () => (dispatch) => dispatch(actions.logOut()),
};

const initialState = {
  authData: null,
};

const authSlice = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    isSignedIn: (state, action) => {
      const user = JSON.parse(localStorage.getItem('user'));
      state.authData = user;
    },
    auth: (state, action) => {
      localStorage.setItem('user', JSON.stringify({ ...action?.payload.data }));
      state.authData = action.payload.data;
    },
    logOut: (state, action) => {
      localStorage.removeItem('user');
      state.authData = null;
    },
  },
});

const actions = authSlice.actions;
export const { reducer } = authSlice;
