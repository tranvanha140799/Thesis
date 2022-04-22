import { combineReducers } from 'redux';

import authReducer from './auth';
import studentsReducer from './students';
import teachersReducer from './teachers';
import salaryChartReducer from './salaryChart';
import teacherPaymentReducer from './teacherPayment';
import expenseOfMonthSheetReducer from './expenseOfMonthSheet';

export default combineReducers({
  authReducer,
  teachersReducer,
  studentsReducer,
  salaryChartReducer,
  teacherPaymentReducer,
  expenseOfMonthSheetReducer,
});
