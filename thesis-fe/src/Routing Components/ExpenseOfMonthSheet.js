import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import ExpenseOfMonthSheetPage from '../components/ExpenseOfMonthSheet';
import AddExpenseOfMonthSheet from '../components/ExpenseOfMonthSheet/add';
import EditExpenseOfMonthSheet from '../components/ExpenseOfMonthSheet/edit';

const ExpenseOfMonthSheet = () => (
  <>
    <Routes>
      <Route
        exact
        path="/expense-of-month-sheets"
        element={<ExpenseOfMonthSheetPage />}
      />
      <Route
        exact
        path="/expense-of-month-sheets/add"
        element={<AddExpenseOfMonthSheet />}
      />
      <Route
        exact
        path="expense-of-month-sheets/:expenseOfMonthSheetId"
        element={<EditExpenseOfMonthSheet />}
      />
    </Routes>

    <Outlet />
  </>
);
export default ExpenseOfMonthSheet;
