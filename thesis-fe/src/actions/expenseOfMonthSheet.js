import * as api from '../api';
import * as actionTypes from '../constants/actionTypes';

// Action Creators
export const getExpenseOfMonthSheets = () => async (dispatch) => {
  try {
    const { data } = await api.getExpenseOfMonthSheets();

    dispatch({ type: actionTypes.FETCH_EXPENSEOFMONTHSHEETS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createExpenseOfMonthSheet = (expenseOfMonthSheet) => async (dispatch) => {
  try {
    const { data } = await api.createExpenseOfMonthSheet(expenseOfMonthSheet);

    dispatch({
      type: actionTypes.CREATE_EXPENSEOFMONTHSHEET,
      payload: data,
      newExpenseOfMonthSheet: expenseOfMonthSheet,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateExpenseOfMonthSheet =
  (id, expenseOfMonthSheet) => async (dispatch) => {
    try {
      const { data } = await api.updateExpenseOfMonthSheet(id, expenseOfMonthSheet);

      dispatch({
        type: actionTypes.UPDATE_EXPENSEOFMONTHSHEET,
        payload: data,
        id,
        expenseOfMonthSheet,
      });
    } catch (error) {
      console.log(error.messsage);
    }
  };

export const deleteExpenseOfMonthSheet = (id) => async (dispatch) => {
  try {
    await api.deleteExpenseOfMonthSheet(id);

    dispatch({ type: actionTypes.DELETE_EXPENSEOFMONTHSHEET, payload: id });
  } catch (error) {
    console.log(error);
  }
};
