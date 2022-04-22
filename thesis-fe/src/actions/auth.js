import * as api from '../api';
import { ISSIGNEDIN, AUTH } from '../constants/actionTypes';

export const signIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, payload: data });

    navigate('/');
  } catch (error) {
    console.log(error);
  }
};

export const isSignedIn = () => async (dispatch) => {
  try {
    dispatch({ type: ISSIGNEDIN });
  } catch (error) {
    console.log(error);
  }
};

export const signUp = (formData, navigate) => async (dispatch) => {
  console.log(formData);
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, payload: data });

    navigate('/');
  } catch (error) {
    console.log(error);
  }
};
