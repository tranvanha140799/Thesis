import produce from 'immer';

import * as actionTypes from '../constants/actionTypes';

const initState = {
  expenseOfMonthSheets: [],
  totalExpenseOfMonthSheets: 0,
};

const expenseOfMonthSheetReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.FETCH_EXPENSEOFMONTHSHEETS:
        draft.expenseOfMonthSheets = action.payload;
        draft.totalExpenseOfMonthSheets = Object.keys(action.payload)?.length;
        break;
      case actionTypes.CREATE_EXPENSEOFMONTHSHEET:
        draft.expenseOfMonthSheets.push(action.newExpenseOfMonthSheet);
        break;
      case actionTypes.UPDATE_EXPENSEOFMONTHSHEET:
        draft.expenseOfMonthSheets.map((expenseOfMonthSheet) => {
          if (expenseOfMonthSheet.id === action.id)
            expenseOfMonthSheet = action.expenseOfMonthSheet;
        });
        break;
      case actionTypes.DELETE_EXPENSEOFMONTHSHEET:
        draft.expenseOfMonthSheets = draft.expenseOfMonthSheet.filter(
          (expenseOfMonthSheet) => expenseOfMonthSheet._id !== action.payload
        );
        --draft.totalExpenseOfMonthSheets;
        break;
      default:
        return draft;
    }
  });

export default expenseOfMonthSheetReducer;
