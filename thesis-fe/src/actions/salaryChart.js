import * as api from '../api';
import * as actionTypes from '../constants/actionTypes';

// Action Creators
export const getSalaries = () => async (dispatch) => {
  try {
    const { data } = await api.getSalaries();

    dispatch({ type: actionTypes.FETCH_SALARIES, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createSalary = (salary) => async (dispatch) => {
  try {
    const { data } = await api.createSalary(salary);

    dispatch({ type: actionTypes.CREATE_SALARY, payload: data, newSalary: salary });
  } catch (error) {
    console.log(error);
  }
};

export const updateSalary = (id, salary) => async (dispatch) => {
  try {
    const { data } = await api.updateSalary(id, salary);

    dispatch({ type: actionTypes.UPDATE_SALARY, payload: data, id, salary });
  } catch (error) {
    console.log(error.messsage);
  }
};

export const deleteSalary = (id) => async (dispatch) => {
  try {
    await api.deleteSalary(id);

    dispatch({ type: actionTypes.DELETE_SALARY, payload: id });
  } catch (error) {
    console.log(error);
  }
};
