import produce from 'immer';

import * as actionTypes from '../constants/actionTypes';

const initState = {
  teacherPayments: [],
  totalTeacherPayments: 0,
};

const teacherPaymentReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.FETCH_TEACHERPAYMENTS:
        draft.teacherPayments = action.payload;
        draft.totalTeacherPayments = Object.keys(action.payload)?.length;
        break;
      case actionTypes.CREATE_TEACHERPAYMENT:
        draft.teacherPayments.push(action.newTeacherPayment);
        break;
      case actionTypes.UPDATE_TEACHERPAYMENT:
        draft.teacherPayments.map((teacherPayment) => {
          if (teacherPayment.id === action.id) teacherPayment = action.teacherPayment;
        });
        break;
      case actionTypes.DELETE_TEACHERPAYMENT:
        draft.teacherPayments = draft.teacherPayments.filter(
          (teacherPayment) => teacherPayment._id !== action.payload
        );
        --draft.totalTeacherPayments;
        break;
      default:
        return draft;
    }
  });

export default teacherPaymentReducer;
