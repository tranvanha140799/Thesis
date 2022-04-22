import * as api from '../api';
import * as actionTypes from '../constants/actionTypes';

// Action Creators
export const getTeacherPayments = () => async (dispatch) => {
  try {
    const { data } = await api.getTeacherPayments();

    dispatch({ type: actionTypes.FETCH_TEACHERPAYMENTS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createTeacherPayment = (teacherPayment) => async (dispatch) => {
  try {
    const { data } = await api.createTeacherPayment(teacherPayment);

    dispatch({
      type: actionTypes.CREATE_TEACHERPAYMENT,
      payload: data,
      newTeacherPayment: teacherPayment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateTeacherPayment = (id, teacherPayment) => async (dispatch) => {
  try {
    const { data } = await api.updateTeacherPayment(id, teacherPayment);

    dispatch({
      type: actionTypes.UPDATE_TEACHERPAYMENT,
      payload: data,
      id,
      teacherPayment,
    });
  } catch (error) {
    console.log(error.messsage);
  }
};

export const deleteTeacherPayment = (id) => async (dispatch) => {
  try {
    await api.deleteTeacherPayment(id);

    dispatch({ type: actionTypes.DELETE_TEACHERPAYMENT, payload: id });
  } catch (error) {
    console.log(error);
  }
};
