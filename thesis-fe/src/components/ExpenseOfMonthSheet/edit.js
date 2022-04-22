import React from 'react';
import { useParams } from 'react-router-dom';
import AddExpenseOfMonthSheet from './add';

const EditExpenseOfMonthSheet = () => {
  const { expenseOfMonthSheetId } = useParams();
  return <AddExpenseOfMonthSheet id={expenseOfMonthSheetId} />;
};

export default EditExpenseOfMonthSheet;
